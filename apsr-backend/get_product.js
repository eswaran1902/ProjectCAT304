const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db')
    .then(async () => {
        const p = await Product.findOne();
        console.log("VALID_PRODUCT_ID=" + p._id);
        process.exit();
    })
    .catch(err => console.log(err));
