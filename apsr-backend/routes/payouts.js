const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PayoutRequest = require('../models/PayoutRequest');
const User = require('../models/User');

// Get All Payout Requests (Pending & Recent History)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const requests = await PayoutRequest.find()
            .populate('salesperson', 'name email bankDetails')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Approve/Reject Single Payout
router.put('/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const { status, note } = req.body; // 'approved', 'rejected', 'paid', plus optional note

    try {
        const request = await PayoutRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        if (note) request.notes = note; // Save rejection reason or approval note
        request.updatedAt = Date.now();
        await request.save();

        req.io.emit('stats_updated', {}); // Notify dashboards

        const logAudit = require('../utils/auditLogger');
        await logAudit(req, {
            user: 'Admin',
            action: status === 'paid' ? 'Approve Payout' : 'Reject Payout',
            target: `Payout #${request._id}`,
            details: `${status === 'paid' ? 'Approved' : 'Rejected'} payout of RM ${request.amount}.${note ? ' Ref: ' + note : ''}`,
            type: 'Action'
        });

        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Process Batch (Mark multiple as 'paid')
router.post('/batch', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    const { ids } = req.body; // Array of PayoutRequest IDs

    if (!ids || ids.length === 0) return res.status(400).json({ msg: 'No IDs provided' });

    try {
        await PayoutRequest.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 'processing', updatedAt: Date.now() } }
        );

        req.io.emit('stats_updated', {});

        const logAudit = require('../utils/auditLogger');
        await logAudit(req, {
            user: 'Admin',
            action: 'Process Payout Batch',
            target: `${ids.length} Requests`,
            details: `Processed batch payout for ${ids.length} requests.`,
            type: 'System'
        });

        res.json({ msg: 'Batch processed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get Batch History (Aggregated by date for UI visualization logic)
// For now, the frontend derives this from the main list, but we can add a specific route if needed.
// Leaving as derived for simplicity to keep "Real-time" consistent with main list.

module.exports = router;
