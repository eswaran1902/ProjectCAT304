const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    try {
        // 1. Login as Admin
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@apsr.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;

        // 2. Fetch Pending
        const pendingRes = await axios.get('http://localhost:5001/api/orders/pending', {
            headers: { 'x-auth-token': token }
        });

        if (pendingRes.data.length === 0) {
            console.log("No pending orders to approve.");
            return;
        }

        const orderId = pendingRes.data[0]._id;
        console.log(`Approving Order: ${orderId}`);

        // 3. Approve
        await axios.put(`http://localhost:5001/api/orders/${orderId}/verify`, {}, {
            headers: { 'x-auth-token': token }
        });
        console.log("Order Approved.");

        // 4. Check DB for Transaction
        // We need to connect to DB to check this since we don't have a direct API to check all transactions easily yet (except maybe admin dashboard)
        console.log("Checking Database for Transaction...");
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db');

        // Wait a moment for async save
        await new Promise(r => setTimeout(r, 1000));

        const txn = await Transaction.findOne({ orderId: { $regex: 'TXN' } }).sort({ createdAt: -1 });
        if (txn) {
            console.log("SUCCESS: Transaction Found!");
            console.log(JSON.stringify(txn, null, 2));
        } else {
            console.log("FAILURE: No Transaction found.");
        }
        process.exit();

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
        process.exit(1);
    }
};

run();
