const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'salesperson', 'buyer'], default: 'salesperson' },
    walletBalance: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    bankDetails: { type: String, default: '' }, // Placeholder for bank info
    isApproved: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    manualTier: { type: String, enum: ['Gold', 'Silver', 'Bronze'], default: null },
    avatar: { type: String }, // URL to uploaded avatar
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
