const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const auth = require('../middleware/auth'); // Optional: Protect public route? No, chat is public.

// Public: Get Active FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Admin: Get All FAQs
router.get('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const faqs = await FAQ.find().sort({ order: 1 });
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Admin: Create FAQ
router.post('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const { question, answer, order } = req.body;
        const newFAQ = new FAQ({ question, answer, order });
        await newFAQ.save();
        res.json(newFAQ);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Admin: Delete FAQ
router.delete('/admin/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ msg: 'FAQ Deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Admin: Update FAQ
router.put('/admin/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    try {
        const { question, answer, order, isActive } = req.body;
        const updated = await FAQ.findByIdAndUpdate(req.params.id, { question, answer, order, isActive }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
