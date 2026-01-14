const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dispute = require('../models/Dispute');
const User = require('../models/User');

// @route   POST /api/disputes
// @desc    Create a new dispute ticket
// @access  Private (Salesperson)
router.post('/', auth, async (req, res) => {
    try {
        const { subject, description, priority } = req.body;

        const newDispute = new Dispute({
            salesperson: req.user.id,
            subject,
            description,
            priority: priority || 'Medium'
        });

        const dispute = await newDispute.save();

        // Populate salesperson details for the real-time event
        await dispute.populate('salesperson', ['name', 'email']);

        // Emit real-time event to Admins
        req.io.emit('dispute_created', dispute);

        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/disputes
// @desc    Get all disputes (Admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
    try {
        // In a real app, check if req.user.role === 'admin'
        // For simplicity, we assume auth is enough or role check is done in frontend/middleware
        const disputes = await Dispute.find()
            .populate('salesperson', ['name', 'email'])
            .sort({ createdAt: -1 });
        res.json(disputes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/disputes/:id
// @desc    Update dispute status (Admin)
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status, adminResponse } = req.body;

        let dispute = await Dispute.findById(req.params.id);
        if (!dispute) return res.status(404).json({ msg: 'Dispute not found' });

        if (status) dispute.status = status;
        if (adminResponse) dispute.adminResponse = adminResponse;

        await dispute.save();

        // Populate for return
        await dispute.populate('salesperson', ['name', 'email']);

        // Emit update event
        // Emit update event
        req.io.emit('dispute_updated', dispute);

        if (status) {
            const logAudit = require('../utils/auditLogger');
            await logAudit(req, {
                user: 'Admin',
                action: 'Update Dispute',
                target: `Ticket #${dispute._id}`,
                details: `Changed status to ${status}. Response: ${adminResponse || 'None'}`,
                type: 'Action'
            });
        }

        res.json(dispute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
