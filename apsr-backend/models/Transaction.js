const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'flagged'], default: 'pending' },
    riskScore: { type: Number, default: 0 }, // 0-100, higher is riskier
    attributionSource: { type: String, enum: ['link', 'qr', 'manual'], default: 'link' },
    timeline: [{
        event: String, // e.g., "Link Clicked", "Order Placed"
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
