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

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGODB_URI;

        // Explicitly check if running local without custom URI
        if (!mongoUri || mongoUri.includes('localhost')) {
            console.log('Local MongoDB not found or default used. Starting in-memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('In-memory MongoDB started at', mongoUri);
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
