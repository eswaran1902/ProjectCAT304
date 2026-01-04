const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true } // Price at time of purchase
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        address: String,
        city: String,
        zip: String,
        country: String
    },
    status: { type: String, default: 'pending' }, // pending, paid, shipped, completed
    paymentMethod: { type: String, default: 'credit_card' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
