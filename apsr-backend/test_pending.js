const axios = require('axios');

const run = async () => {
    try {
        // 1. Login as Admin
        console.log("Logging in as Admin...");
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'admin@apsr.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log("Logged in. Token acquired.");

        // 2. Fetch Pending Orders
        console.log("Fetching pending orders...");
        const res = await axios.get('http://localhost:5001/api/orders/pending', {
            headers: { 'x-auth-token': token }
        });

        console.log("Response Status:", res.status);
        console.log("Orders Found:", res.data.length);
        console.log("First Order:", JSON.stringify(res.data[0], null, 2));

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

run();
