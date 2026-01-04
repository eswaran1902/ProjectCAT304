const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const { calculateRiskScore } = require('../utils/riskEngine');

const Order = require('../models/Order');

// Create Order (Checkout)
router.post('/', async (req, res) => {
    const { buyerId, items, shippingAddress, paymentMethod, salespersonId } = req.body;

    // items: [{ productId, quantity }]

    try {
        let totalAmount = 0;
        const formattedItems = [];

        // 1. Validate Items & Calculate Total
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ msg: `Product ${item.productId} not found` });
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            formattedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // 2. Create Transaction (Commission) - ONLY if salesperson is linked
            if (salespersonId) {
                const salesperson = await User.findById(salespersonId);
                if (salesperson) {
                    // Calculate Commission
                    let commission = 0;
                    if (product.commissionType === 'percentage') {
                        commission = (product.price * product.commissionRate * item.quantity) / 100;
                    } else {
                        commission = product.commissionRate * item.quantity;
                    }

                    // Risk Check
                    const riskData = { amount: itemTotal, userAgent: req.headers['user-agent'] };
                    const riskScore = calculateRiskScore(riskData);
                    const status = riskScore > 80 ? 'flagged' : 'pending';

                    const transaction = new Transaction({
                        orderId: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                        customerName: 'Buyer ' + buyerId, // Placeholder logic
                        product: product._id,
                        salesperson: salesperson._id,
                        amount: itemTotal,
                        commissionAmount: commission,
                        status,
                        riskScore,
                        attributionSource: 'link'
                    });
                    await transaction.save();
                }
            }
        }

        // 3. Create Order
        const newOrder = new Order({
            buyer: buyerId,
            items: formattedItems,
            totalAmount,
            shippingAddress,
            paymentMethod, // e.g. 'credit_card'
            status: 'paid' // Automatically marked paid for demo
        });

        const savedOrder = await newOrder.save();

        res.json(savedOrder);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
