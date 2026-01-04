const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware
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

// Place Order (Customer)
router.post('/', auth, async (req, res) => {
    const { products, totalAmount } = req.body; // products: [{ product: id, quantity: n }]
    try {
        const newOrder = new Order({
            buyer: req.user.id,
            products,
            totalAmount,
            status: 'pending'
        });

        // Update product quantities (Simple version, normally would use transactions)
        for (const item of products) {
            await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
        }

        const order = await newOrder.save();
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Pay Order (Customer)
router.post('/:id/pay', auth, async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        if (order.buyer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        order.status = 'paid';
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get My Orders (Customer)
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
