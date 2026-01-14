const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db')
    .then(async () => {
        const orders = await Order.find({ status: 'pending_approval' });
        console.log("PENDING ORDERS:", JSON.stringify(orders, null, 2));
        process.exit();
    })
    .catch(err => console.log(err));
