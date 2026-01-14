const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order'); // Import Order model
const Transaction = require('./models/Transaction');
const fs = require('fs');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db');

        // 1. Get/Fix Salesperson
        console.log("Finding Salesperson...");
        let user = await User.findOne({ email: 'ahmad@apsr.com' });
        if (!user) {
            console.log("Creating dummy salesperson...");
            user = await User.create({
                name: 'Ahmad Rozali',
                email: 'ahmad@apsr.com',
                password: 'password', // Dummy
                role: 'salesperson',
                referralCode: 'AHMAD123'
            });
        }
        if (!user.referralCode) {
            console.log("Generating referral code for user...");
            user.referralCode = 'AHMADTEST';
            await user.save();
        }
        console.log(`Using Salesperson: ${user.name} (Code: ${user.referralCode})`);

        // 2. Place Order via API (simulating frontend)
        console.log("Placing Order...");
        const form = new FormData();
        form.append('buyerId', '650d3f8e9a2b5c7d1e8f9a2b'); // Dummy buyer
        // Use a valid Product ID from DB or fallback
        form.append('items', JSON.stringify([{ productId: '695db851a436861d5a4f3462', quantity: 1 }]));
        form.append('shippingAddress', JSON.stringify({ address: 'Test', city: 'KL', zip: '50', country: 'MY' }));
        form.append('paymentMethod', 'qr_pay');
        form.append('referralCode', user.referralCode);
        if (!fs.existsSync('dummy.jpg')) fs.writeFileSync('dummy.jpg', 'x');
        form.append('receipt', fs.createReadStream('dummy.jpg'));

        const orderRes = await axios.post('http://localhost:5001/api/orders', form, { headers: { ...form.getHeaders() } });
        const orderId = orderRes.data._id;
        console.log(`Order Placed: ${orderId}`);

        // 3. Admin Login & Approve
        console.log("Approving...");
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', { email: 'admin@apsr.com', password: 'admin123' });
        const token = loginRes.data.token;

        await axios.put(`http://localhost:5001/api/orders/${orderId}/verify`, {}, { headers: { 'x-auth-token': token } });
        console.log("Order Approved.");

        // 4. Verify Transaction
        // Wait for async background processing
        await new Promise(r => setTimeout(r, 2000));

        const txn = await Transaction.findOne({ orderId: { $regex: orderId.toString() } }); // Searching by order reference in orderId string potentially? 
        // Actually txn.orderId usually is "TXN-..." 
        // We filter by salesperson
        const txns = await Transaction.find({ salesperson: user._id }).sort({ createdAt: -1 });
        if (txns.length > 0) {
            console.log(`SUCCESS: Found ${txns.length} transactions for salesperson.`);
            console.log(`Latest Amount: ${txns[0].commissionAmount}`);
        } else {
            console.log("FAILURE: No transactions found.");
        }

        process.exit();

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
        console.error(err);
        process.exit(1);
    }
};

run();
