const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
    salesperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Review', 'Resolved', 'Rejected'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    adminResponse: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
