const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

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
// Database Connection
const connectDB = async () => {
    try {
        const dbPath = path.join(__dirname, 'apsr-local-db');
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }

        console.log('Forcing In-Memory MongoDB with Persistence...');
        const mongod = await MongoMemoryServer.create({
            instance: {
                dbPath: dbPath,
                storageEngine: 'wiredTiger'
            }
        });

        const mongoUri = mongod.getUri();
        console.log('Local MongoDB started at', mongoUri);
        console.log('Data persisting to:', dbPath);

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected (Local Persistent)');
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
app.use('/api/payouts', require('./routes/payouts'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/disputes', require('./routes/disputes'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/faq', require('./routes/faqRoutes'));

// Connect to DB
connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
