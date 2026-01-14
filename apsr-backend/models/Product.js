const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    commissionRate: { type: Number, required: true }, // e.g., 10 for 10% or fixed amount
    commissionType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to Partner/User
});

module.exports = mongoose.model('Product', productSchema);
