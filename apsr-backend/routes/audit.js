const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

// @route   GET /api/audit
// @desc    Get all audit logs (Admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(500); // Limit to last 500 for performance
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
