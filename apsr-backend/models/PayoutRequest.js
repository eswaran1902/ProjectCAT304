const mongoose = require('mongoose');

const payoutRequestSchema = new mongoose.Schema({
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PayoutRequest', payoutRequestSchema);
