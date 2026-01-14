const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');

const multer = require('multer');
const path = require('path');

// Set up Multer for storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate('provider', 'name email');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get My Products (Partner specific)
router.get('/myproducts', auth, async (req, res) => {
    try {
        const products = await Product.find({ provider: req.user.id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new product (Protected)
router.post('/', [auth, upload.single('image')], async (req, res) => {
    const { name, category, price, commissionRate, commissionType, description, quantity } = req.body;

    // Construct simplified URL
    let imageUrl = '';
    if (req.file) {
        // In production, use environment variable for host
        imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
        // Allow manual URL if no file uploaded
        imageUrl = req.body.imageUrl;
    }

    try {
        const newProduct = new Product({
            name,
            category: category || 'General',
            price,
            commissionRate: commissionRate || 0,
            commissionType: commissionType || 'percentage',
            description,
            quantity: quantity || 0,
            provider: req.user.id,
            imageUrl
        });
        const product = await newProduct.save();
        req.io.emit('product_updated', product);
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a product (Protected)
router.put('/:id', auth, async (req, res) => {
    const { name, category, price, commissionRate, commissionType, description, quantity } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Check user ownership
        if (product.provider && product.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.commissionRate = commissionRate || product.commissionRate;
        product.commissionType = commissionType || product.commissionType;
        product.description = description || product.description;
        product.quantity = quantity || product.quantity;

        await product.save();
        req.io.emit('product_updated', product);
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a product (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Check user ownership
        if (product.provider && product.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);
        req.io.emit('product_updated', { _id: req.params.id, deleted: true });
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
