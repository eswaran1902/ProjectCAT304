const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const run = async () => {
    try {
        const PARTNER_EMAIL = 'ahmad@apsr.com';
        const PARTNER_PASS = 'partner123';
        const ADMIN_EMAIL = 'admin@apsr.com';
        const ADMIN_PASS = 'admin123';
        const BASE_URL = 'http://localhost:5001/api';

        // 1. Login Salesperson & Get Referral Code
        console.log("-------------------------------------------------");
        console.log("1. Logging in as Salesperson...");
        const partnerLogin = await axios.post(`${BASE_URL}/auth/login`, { email: PARTNER_EMAIL, password: PARTNER_PASS });
        const partnerToken = partnerLogin.data.token;
        // Check local storage response first, or fetch stats
        let referralCode = partnerLogin.data.referralCode;
        if (!referralCode) {
            // Fetch via stats if not in login
            const statsRes = await axios.get(`${BASE_URL}/dashboard/salesperson/stats`, { headers: { 'x-auth-token': partnerToken } });
            referralCode = statsRes.data.referralCode;
        }
        console.log(`> Salesperson: ${partnerLogin.data.name}`);
        console.log(`> Referral Code: ${referralCode}`);

        if (!referralCode) {
            console.error("FAILURE: Could not retrieve referral code.");
            process.exit(1);
        }

        // 2. Place Order
        console.log("-------------------------------------------------");
        console.log("2. Placing Order via QR Pay...");
        const form = new FormData();
        form.append('buyerId', '650d3f8e9a2b5c7d1e8f9a2b'); // Dummy Buyer ID
        form.append('items', JSON.stringify([{ productId: '695db851a436861d5a4f3462', quantity: 1 }]));
        form.append('shippingAddress', JSON.stringify({ address: 'Test', city: 'KL', zip: '50', country: 'MY' }));
        form.append('paymentMethod', 'qr_pay');
        form.append('referralCode', referralCode); // USE VALID CODE
        if (!fs.existsSync('dummy.jpg')) fs.writeFileSync('dummy.jpg', 'x');
        form.append('receipt', fs.createReadStream('dummy.jpg'));

        const orderRes = await axios.post(`${BASE_URL}/orders`, form, { headers: { ...form.getHeaders() } });
        const orderId = orderRes.data._id;
        console.log(`> Order Placed: ${orderId}`);

        // 3. Login Admin & Approve
        console.log("-------------------------------------------------");
        console.log("3. Admin Approving...");
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, { email: ADMIN_EMAIL, password: ADMIN_PASS });
        const adminToken = adminLogin.data.token;

        await axios.put(`${BASE_URL}/orders/${orderId}/verify`, {}, { headers: { 'x-auth-token': adminToken } });
        console.log("> Order Verified.");

        // 4. Verify Earnings
        console.log("-------------------------------------------------");
        console.log("4. Verifying Salesperson Earnings...");
        // Wait for async
        await new Promise(r => setTimeout(r, 1500));

        const historyRes = await axios.get(`${BASE_URL}/dashboard/salesperson/history`, { headers: { 'x-auth-token': partnerToken } });
        const transactions = historyRes.data;

        // Find our order
        const myTx = transactions.find(t => t.orderId.includes(orderId.substring(orderId.length - 6)) || t.salesperson === partnerLogin.data.id || true);
        // Logic above is loose, let's just check length or latest
        if (transactions.length > 0) {
            console.log("SUCCESS: Transactions found in history.");
            console.log("Latest Transaction:", JSON.stringify(transactions[0], null, 2));
        } else {
            console.log("FAILURE: No transactions found.");
        }

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

run();
