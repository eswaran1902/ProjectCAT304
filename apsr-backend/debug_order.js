const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const run = async () => {
    try {
        const form = new FormData();
        form.append('buyerId', '650d3f8e9a2b5c7d1e8f9a2b');
        form.append('items', JSON.stringify([{ productId: '695db851a436861d5a4f3462', quantity: 1 }])); // Need a valid dummy product ID
        form.append('shippingAddress', JSON.stringify({ address: 'Test St', city: 'KL', zip: '50000', country: 'Malaysia' }));
        form.append('paymentMethod', 'qr_pay');
        form.append('referralCode', '8470AA18');

        // Ensure a dummy file exists
        if (!fs.existsSync('dummy.jpg')) fs.writeFileSync('dummy.jpg', 'dummy content');
        form.append('receipt', fs.createReadStream('dummy.jpg'));

        console.log("Sending request...");
        const res = await axios.post('http://localhost:5001/api/orders', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

run();
