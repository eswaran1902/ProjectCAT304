const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
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

const PayoutRequest = require('../models/PayoutRequest');

// Salesperson Stats
router.get('/salesperson/stats', auth, async (req, res) => {
    if (req.user.role !== 'salesperson') return res.status(403).json({ msg: 'Access denied' });
    try {
        const pending = await Transaction.aggregate([
            { $match: { salesperson: new mongoose.Types.ObjectId(req.user.id), status: 'pending' } },
            { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
        ]);
        const paid = await Transaction.aggregate([
            { $match: { salesperson: new mongoose.Types.ObjectId(req.user.id), status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
        ]);

        // Calculate Total Earnings (All time commissions)
        const totalEarnings = (pending[0]?.total || 0) + (paid[0]?.total || 0);

        // Calculate Total Payouts Requested/Paid
        const payouts = await PayoutRequest.aggregate([
            { $match: { salesperson: new mongoose.Types.ObjectId(req.user.id), status: { $ne: 'rejected' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalPayouts = payouts[0]?.total || 0;

        // Balance = Total Earnings - Requests
        const balance = totalEarnings - totalPayouts;

        // Count total clicks (Mock for now, or implement click tracking later)
        const totalClicks = 124;

        // Fetch user to get referral code
        const user = await User.findById(req.user.id);
        if (user && !user.referralCode) {
            const crypto = require('crypto');
            user.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
            await user.save();
        }

        res.json({
            pending: balance, // Display 'pending' as the Available Balance
            paid: totalPayouts, // Display 'paid' as Amount Withdrawn/Requested
            total: totalEarnings,
            referralCode: user ? user.referralCode : null,
            clicks: totalClicks
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Request Payout
router.post('/salesperson/payouts', auth, async (req, res) => {
    if (req.user.role !== 'salesperson') return res.status(403).json({ msg: 'Access denied' });
    try {
        // 1. Calculate Available Balance
        const commissions = await Transaction.aggregate([
            { $match: { salesperson: new mongoose.Types.ObjectId(req.user.id) } }, // Consider all commissions for simplicity or filter by status
            { $group: { _id: null, total: { $sum: '$commissionAmount' } } }
        ]);
        const totalCommissions = commissions[0]?.total || 0;

        const payouts = await PayoutRequest.aggregate([
            { $match: { salesperson: new mongoose.Types.ObjectId(req.user.id), status: { $ne: 'rejected' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalPayouts = payouts[0]?.total || 0;

        const balance = totalCommissions - totalPayouts;

        // 2. Validate Request
        if (balance < 50) {
            return res.status(400).json({ msg: 'Insufficient balance. Minimum payout is RM 50.00' });
        }

        // 3. Create Request
        const newPayout = new PayoutRequest({
            salesperson: req.user.id,
            amount: balance // Request full balance for now
        });

        await newPayout.save();

        res.json(newPayout);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Salesperson Transaction History
router.get('/salesperson/history', auth, async (req, res) => {
    if (req.user.role !== 'salesperson') return res.status(403).json({ msg: 'Access denied' });
    try {
        const history = await Transaction.find({ salesperson: req.user.id })
            .sort({ date: -1 })
            .populate('product', 'name'); // Get product name

        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin Stats
// Admin Stats (Real-time Detailed)
router.get('/admin/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        // 1. Headlines
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalGMV: { $sum: '$amount' },
                    totalPendingComm: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, "$commissionAmount", 0]
                        }
                    },
                    totalPaidComm: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "paid"] }, "$commissionAmount", 0]
                        }
                    },
                    flaggedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "flagged"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const headlines = stats[0] || { totalGMV: 0, totalPendingComm: 0, totalPaidComm: 0, flaggedCount: 0 };

        // 2. Sales Trend (Last 7 Days) - Simplified for demo (Group by Day)
        // Note: MongoDB dates are detailed, we project dateToString to group by day.
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesTrend = await Transaction.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$amount" },
                    com: { $sum: "$commissionAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Channel Mix
        const channelMix = await Transaction.aggregate([
            { $group: { _id: "$attributionSource", value: { $sum: 1 } } }
        ]);

        // 4. Top Performers
        const topPerformers = await Transaction.aggregate([
            { $group: { _id: "$salesperson", totalComm: { $sum: "$commissionAmount" }, salesCount: { $sum: 1 } } },
            { $sort: { totalComm: -1 } },
            { $limit: 3 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: "$user" },
            { $project: { name: "$user.name", totalComm: 1, salesCount: 1 } }
        ]);

        res.json({
            headlines,
            salesTrend: salesTrend.map(t => ({ name: t._id, sales: t.sales, com: t.com })),
            channelMix: channelMix.map(c => ({ name: c._id || 'Direct', value: c.value })),
            topPerformers
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin Attribution & Audit Data
router.get('/admin/attribution', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        // 1. Audit Queue: Recent Transactions (Limit 50)
        const auditQueue = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('salesperson', 'name')
            .populate('product', 'name');

        // 2. Mismatch Queue: Flagged Transactions or Suspicious High Risk
        // In our simplified model, we use riskScore > 80 OR 'flagged' status
        const mismatchQueue = await Transaction.find({
            $or: [
                { status: 'flagged' },
                { riskScore: { $gt: 80 } }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('salesperson', 'name')
            .populate('product', 'name');

        res.json({
            auditQueue,
            mismatchQueue
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get All Salespeople with Stats
router.get('/admin/users', auth, async (req, res) => {
    try {
        const users = await User.find({ role: 'salesperson' }).select('-password').sort({ createdAt: -1 });

        // Aggregate stats from Transactions
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: "$salesperson",
                    totalSales: { $sum: "$amount" },
                    ordersCount: { $sum: 1 }
                }
            }
        ]);

        // Merge stats into user objects
        const usersWithStats = users.map(user => {
            const userStats = stats.find(s => s._id?.toString() === user._id.toString()) || { totalSales: 0, ordersCount: 0 };
            return {
                ...user.toObject(),
                totalSales: userStats.totalSales,
                ordersCount: userStats.ordersCount,
                tier: user.manualTier || (userStats.totalSales > 50000 ? 'Gold' : userStats.totalSales > 10000 ? 'Silver' : 'Bronze')
            };
        });

        res.json(usersWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin Ledger Data
router.get('/admin/ledger', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        // 1. Get Commissions (Transactions)
        const commissions = await Transaction.find()
            .populate('salesperson', 'name')
            .lean();

        // 2. Get Payouts
        const payouts = await PayoutRequest.find()
            .populate('salesperson', 'name')
            .lean();

        // 3. Unify Format
        const ledger = [
            ...commissions.map(c => ({
                id: c.orderId, // TX-ID or Order ID
                transactionId: c._id,
                date: c.createdAt,
                salesperson: c.salesperson?.name || 'Unknown',
                type: c.type ? (c.type.charAt(0).toUpperCase() + c.type.slice(1)) : 'Commission',
                desc: c.type !== 'commission' ? c.customerName : `Order ${c.orderId || '-'}`, // Use proper description
                amount: c.commissionAmount,
                status: c.status === 'paid' ? 'Payable' : c.status === 'pending' ? 'Pending' : 'Flagged',
                rawDate: new Date(c.createdAt)
            })),
            ...payouts.map(p => ({
                id: p._id, // PAY-ID
                date: p.requestedAt,
                salesperson: p.salesperson?.name || 'Unknown',
                type: 'Payout',
                desc: `Withdrawal Request`,
                amount: -p.amount, // Debit
                status: p.status === 'approved' ? 'Paid' : p.status === 'pending' ? 'Pending' : 'Rejected',
                rawDate: new Date(p.requestedAt)
            }))
        ];

        // 4. Sort by Date Descending
        ledger.sort((a, b) => b.rawDate - a.rawDate);

        res.json(ledger);

    } catch (err) {
        console.error("Ledger Error:", err);
        res.status(500).send('Server Error');
    }
});

// Create Manual Ledger Entry
router.post('/admin/ledger/entry', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const { salespersonId, type, amount, description, status } = req.body;

    try {
        const salesperson = await User.findById(salespersonId);
        if (!salesperson) return res.status(404).json({ msg: 'Salesperson not found' });

        // Map UI types to schema types
        // UI: 'Adjustment (Credit)', 'Adjustment (Debit)', 'Bonus', 'Fee Deduction'
        // Schema: 'commission', 'adjustment', 'bonus', 'fee'

        let schemaType = 'adjustment';
        let finalAmount = parseFloat(amount);

        if (type.includes('Bonus')) schemaType = 'bonus';
        if (type.includes('Fee')) { schemaType = 'fee'; finalAmount = -Math.abs(finalAmount); }
        if (type.includes('Debit')) { schemaType = 'adjustment'; finalAmount = -Math.abs(finalAmount); }

        const manualId = 'MAN-' + Date.now().toString().slice(-6);

        const transaction = new Transaction({
            orderId: manualId,
            customerName: description || 'Manual Adjustment',
            salesperson: salespersonId,
            type: schemaType,
            amount: 0, // No sale value associated
            commissionAmount: finalAmount,
            status: status || 'paid',
            attributionSource: 'manual',
            riskScore: 0
        });

        await transaction.save();
        req.io.emit('stats_updated', {});

        res.json(transaction);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Simplified Salespeople List for Dropdown
router.get('/admin/salespeople-list', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const users = await User.find({ role: 'salesperson' }).select('name email _id');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
