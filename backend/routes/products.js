const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify token and role
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const isPartner = (req, res, next) => {
    if (req.user.role !== 'partner') {
        return res.status(403).json({ msg: 'Access denied: Partners only' });
    }
    next();
};

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name');
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create Product (Partner only)
router.post('/', [auth, isPartner], async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            seller: req.user.id
        });
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Product (Partner only)
router.put('/:id', [auth, isPartner], async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, price, quantity } },
            { new: true }
        );
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get My Products (Partner only)
router.get('/myproducts', [auth, isPartner], async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user.id });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
