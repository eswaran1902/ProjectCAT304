const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db')
    .then(async () => {
        const user = await User.findOne({ email: 'ahmad@apsr.com' });
        if (user) {
            console.log(`User: ${user.name}`);
            console.log(`Referral Code: ${user.referralCode}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log("User 'ahmad@apsr.com' not found.");
        }
        process.exit();
    })
    .catch(err => console.log(err));
