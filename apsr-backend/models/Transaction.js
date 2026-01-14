const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional for manual entries
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['commission', 'adjustment', 'bonus', 'fee'], default: 'commission' },
    amount: { type: Number, required: true }, // Sale Amount (0 for bonuses)
    commissionAmount: { type: Number, required: true }, // Actual money moving
    status: { type: String, enum: ['pending', 'paid', 'flagged'], default: 'paid' }, // Manual entries usually 'paid' immediately or 'pending'
    riskScore: { type: Number, default: 0 }, // 0-100, higher is riskier
    attributionSource: { type: String, enum: ['link', 'qr', 'manual'], default: 'link' },
    timeline: [{
        event: String, // e.g., "Link Clicked", "Order Placed"
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
