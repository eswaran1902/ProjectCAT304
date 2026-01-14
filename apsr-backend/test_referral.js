const axios = require('axios');

async function testReferral() {
    const email = `testuser_${Date.now()}@test.com`;
    const password = 'password123';

    console.log(`1. Registering ${email}...`);
    try {
        const regRes = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test User',
            email,
            password,
            role: 'salesperson'
        });

        console.log('Register Response Code:', regRes.data.referralCode);

        const token = regRes.data.token;

        console.log('2. checking /me endpoint...');
        const meRes = await axios.get('http://localhost:5001/api/auth/me', {
            headers: { 'x-auth-token': token }
        });

        console.log('Me Response Code:', meRes.data.referralCode);

        if (!regRes.data.referralCode) console.error('FAIL: No code in register response');
        if (!meRes.data.referralCode) console.error('FAIL: No code in /me response');

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testReferral();
