const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
    try {
        const dbPath = path.join(__dirname, 'backend-local-db');
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
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Marketplace Backend Running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
