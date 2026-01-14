const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const { calculateRiskScore } = require('../utils/riskEngine');

const Order = require('../models/Order');

// Multer Setup
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'receipt-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create Order (Checkout)
router.post('/', upload.single('receipt'), async (req, res) => {
    const { buyerId, items, shippingAddress, paymentMethod, salespersonId, referralCode } = req.body;

    // items: [{ productId, quantity }]

    try {
        let totalAmount = 0;
        const formattedItems = [];
        let finalSalespersonId = salespersonId;

        // Normalize data (Handle JSON vs FormData)
        const itemsData = typeof items === 'string' ? JSON.parse(items) : items;
        const shippingAddressData = typeof shippingAddress === 'string' ? JSON.parse(shippingAddress) : shippingAddress;

        // 1. Validate Items & Calculate Total
        for (const item of itemsData) {
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
        }

        // Resolve Referral Code to Salesperson ID
        if (referralCode && !finalSalespersonId) {
            const cleanCode = referralCode.trim();
            // 1. Try resolving by custom referral code
            const referrer = await User.findOne({ referralCode: cleanCode });
            if (referrer) {
                finalSalespersonId = referrer._id;
            } else if (mongoose.isValidObjectId(cleanCode)) {
                // 2. Fallback: Try resolving by direct User ID (as requested by user)
                const referrerById = await User.findById(cleanCode);
                if (referrerById) {
                    finalSalespersonId = referrerById._id;
                }
            }

            // If code was provided but no salesperson found, return error
            if (!finalSalespersonId) {
                return res.status(400).json({ msg: 'Invalid Referral Code' });
            }
        }

        // 3. Create Order
        const isQrPay = paymentMethod === 'qr_pay';
        const initialStatus = isQrPay ? 'pending_approval' : 'paid';

        const newOrder = new Order({
            buyer: buyerId,
            salesperson: finalSalespersonId,
            items: formattedItems,
            totalAmount,
            shippingAddress: shippingAddressData,
            paymentMethod,
            status: initialStatus,
            receiptImage: req.file ? `/uploads/${req.file.filename}` : null
        });

        const savedOrder = await newOrder.save();

        // 4. Create Transactions (ONLY if NOT pending approval)
        // If QR pay, we defer this to the admin verification step.
        if (!isQrPay && finalSalespersonId) {
            // Direct payment -> Immediately Paid commission
            await createTransactionsForOrder(savedOrder, formattedItems, finalSalespersonId, req, 'paid');
        }

        // Notify Clients
        req.io.emit('order_created', savedOrder);
        req.io.emit('stats_updated', {}); // Trigger global stat refresh

        res.json(savedOrder);



    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message, stack: err.stack });
    }
});

const auth = require('../middleware/auth');

// Get Partner Orders (Protected) - Orders containing partner's products
router.get('/partner-orders', auth, async (req, res) => {
    try {
        // 1. Find products owned by this partner
        const partnerProducts = await Product.find({ provider: req.user.id }).select('_id');
        const productIds = partnerProducts.map(p => p._id);

        if (productIds.length === 0) {
            return res.json([]);
        }

        // 2. Find orders containing these products
        const orders = await Order.find({ 'items.product': { $in: productIds } })
            .populate('buyer', 'name email')
            .populate('items.product', 'name price provider')
            .sort({ createdAt: -1 });

        // 3. Filter items to only show those belonging to the partner
        // (An order might have mixed items, we only want to show the partner theirs)
        const formattedOrders = orders.map(order => {
            const myItems = order.items.filter(item =>
                item.product && item.product.provider && item.product.provider.toString() === req.user.id
            );

            if (myItems.length === 0) return null;

            return {
                _id: order._id,
                buyer: order.buyer,
                shippingAddress: order.shippingAddress,
                status: order.status,
                createdAt: order.createdAt,
                items: myItems,
                // Calculate total for just my items
                totalAmount: myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            };
        }).filter(o => o !== null);

        res.json(formattedOrders);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ... existing code ...

// Helper function to create transactions
async function createTransactionsForOrder(order, items, salespersonId, req, forcedStatus = 'pending') {
    const salesperson = await User.findById(salespersonId);
    if (!salesperson) return;

    for (const item of items) {
        // Calculate Commission
        let commission = 0;
        // In saved order items derived from formattedItems, price is stored.
        // We can optimize by not re-fetching product if we trust the order price,
        // but for commission settings we must fetch the Product document again as it's not fully in order.
        const product = await Product.findById(item.product);
        if (!product) continue;

        if (product.commissionType === 'percentage') {
            commission = (item.price * product.commissionRate * item.quantity) / 100;
        } else {
            commission = product.commissionRate * item.quantity;
        }

        // Risk Check (simplified reuse)
        const itemTotal = item.price * item.quantity;
        const riskData = { amount: itemTotal, userAgent: req.headers['user-agent'] };
        const riskScore = calculateRiskScore(riskData);

        // Determine Status: If flagged, stay flagged. Else use forcedStatus (default pending, usually 'paid' if verified)
        let status = riskScore > 80 ? 'flagged' : forcedStatus;

        const transaction = new Transaction({
            orderId: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            customerName: 'Buyer ' + (order.buyer ? order.buyer : 'Unknown'), // simplified
            product: product._id,
            salesperson: salesperson._id,
            amount: itemTotal,
            commissionAmount: commission,
            status,
            riskScore,
            attributionSource: 'link',
            createdAt: order.createdAt // Align with order date
        });
        await transaction.save();
    }
}

// ... (pending route unchanged)

// Get Pending Orders (Admin)
router.get('/pending', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const orders = await Order.find({ status: 'pending_approval' })
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 5. Admin Verify Order (Approve QR Payment)
router.put('/:id/verify', auth, async (req, res) => {
    console.log(`Verify Request received for Order: ${req.params.id}`);
    console.log(`User: ${req.user.id}, Role: ${req.user.role}`);

    // Check if admin
    if (req.user.role !== 'admin') {
        console.log("Access denied: Not admin");
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            console.log("Order not found");
            return res.status(404).json({ msg: 'Order not found' });
        }

        console.log(`Order Found. Status: ${order.status}`);
        if (order.status !== 'pending_approval') {
            console.log("Order is not pending approval");
            return res.status(400).json({ msg: 'Order is not pending approval' });
        }

        order.status = 'paid';
        await order.save();
        console.log("Order status updated to paid");

        if (order.salesperson) {
            console.log(`Generating transactions for salesperson: ${order.salesperson}`);
            // Force status to 'paid' so commission is immediately available
            await createTransactionsForOrder(order, order.items, order.salesperson, req, 'paid');
            console.log("Transactions generated");
        } else {
            console.log("No salesperson attributed to this order. Skipping commissions.");
        }

        req.io.emit('order_updated', order);
        req.io.emit('stats_updated', {});

        const logAudit = require('../utils/auditLogger');
        await logAudit(req, {
            user: 'Admin',
            action: 'Verify Order',
            target: `Order #${order._id}`,
            details: `Manually verified QR payment for Order #${order._id}`,
            type: 'Action'
        });

        res.json({ msg: 'Order approved', order });

    } catch (err) {
        console.error("Verify Route Error:", err);
        res.status(500).json({ msg: err.message, stack: err.stack });
    }
});

// Admin Get All Orders (Real-time listing)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const orders = await Order.find()
            .populate('buyer', 'name email')
            .populate('salesperson', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
