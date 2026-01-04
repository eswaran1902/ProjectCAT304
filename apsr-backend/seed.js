const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apsr_db')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        // Clear existing
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const partnerPass = await bcrypt.hash('partner123', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@apsr.com',
            password: adminPass,
            role: 'admin',
            isApproved: true
        });

        // Create Salesperson
        const partner = await User.create({
            name: 'John Sales',
            email: 'john@apsr.com',
            password: partnerPass,
            role: 'salesperson',
            walletBalance: 120
        });

        // Create Products
        await Product.create([
            { name: 'Premium Cloud Host', price: 200, commissionRate: 20, description: 'High performance hosting.' },
            { name: 'Enterprise CRM', price: 5000, commissionRate: 10, description: 'Full suite CRM.' },
            { name: 'VPN Service', price: 50, commissionRate: 30, description: 'Secure surfing.' }
        ]);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
