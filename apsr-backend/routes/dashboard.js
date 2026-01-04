const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
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

// Salesperson Stats
router.get('/salesperson/stats', auth, async (req, res) => {
    if (req.user.role !== 'salesperson') return res.status(403).json({ msg: 'Access denied' });
    try {
        const pending = await Transaction.aggregate([
            { $match: { salesperson: new Object(req.user.id), status: 'pending' } },
            { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
        ]);
        const paid = await Transaction.aggregate([
            { $match: { salesperson: new Object(req.user.id), status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
        ]);
        res.json({
            pending: pending[0]?.total || 0,
            paid: paid[0]?.total || 0,
            total: (pending[0]?.total || 0) + (paid[0]?.total || 0)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin Stats
router.get('/admin/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const totalGMV = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
        const totalCommissions = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);
        const activeSalespeople = await User.countDocuments({ role: 'salesperson' });

        res.json({
            totalGMV: totalGMV[0]?.total || 0,
            totalCommissions: totalCommissions[0]?.total || 0,
            activeSalespeople
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
