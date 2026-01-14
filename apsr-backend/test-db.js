const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
console.log('Testing connection to:', mongoUri);

if (!mongoUri) {
    console.error('MONGODB_URI is undefined in .env');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
