const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const seedDatabase = async () => {
    try {
        const count = await User.countDocuments();
        if (count > 0) return; // Only seed if empty

        console.log('Seeding database...');
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const partnerPass = await bcrypt.hash('partner123', salt);

        await User.create({
            name: 'Admin User',
            email: 'admin@apsr.com',
            password: adminPass,
            role: 'admin',
            isApproved: true // Super Admin
        });

        await User.create({
            name: 'Ahmad Rozali',
            email: 'ahmad@apsr.com',
            password: partnerPass,
            role: 'salesperson',
            walletBalance: 120
        });

        await Product.create([
            { name: 'Premium Cloud Host', price: 200, commissionRate: 20, description: 'High performance hosting.', commissionType: 'percentage' },
            { name: 'Enterprise CRM', price: 5000, commissionRate: 10, description: 'Full suite CRM.', commissionType: 'percentage' },
            { name: 'VPN Service', price: 50, commissionRate: 30, description: 'Secure surfing.', commissionType: 'fixed' }
        ]);
        console.log('Database Auto-Seeded');
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

app.get('/seed', async (req, res) => {
    try {
        await User.deleteMany({});
        await Product.deleteMany({});
        await seedDatabase(); // Reuse logic but force clear first
        res.send('Database Seeded Successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Database Connection
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGODB_URI;
        if (!mongoUri || mongoUri.includes('localhost')) {
            console.log('Local MongoDB not found or default used. Starting in-memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('In-memory MongoDB started at', mongoUri);
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
        await seedDatabase();
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Connect to DB
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
