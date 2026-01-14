const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SystemSettings = require('../models/SystemSettings');
const logAudit = require('../utils/auditLogger');

// @route   GET /api/settings
// @desc    Get global settings (ensure one exists)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/settings
// @desc    Update global settings
// @access  Private (Admin)
router.put('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    const { commissionRate, commissionCap, autoApproveLowRisk } = req.body;

    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        settings.commissionRate = commissionRate;
        settings.commissionCap = commissionCap;
        settings.autoApproveLowRisk = autoApproveLowRisk;
        settings.updatedAt = Date.now();

        await settings.save();

        await logAudit(req, {
            user: 'Admin',
            action: 'Update Settings',
            target: 'Global Config',
            details: `Updated Commission Rate: ${commissionRate}%, Cap: $${commissionCap}`,
            type: 'System'
        });

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
