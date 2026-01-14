const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    user: {
        type: String, // Storing Name directly for immutability (or could be Ref)
        required: true
    },
    action: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    type: {
        type: String,
        enum: ['Security', 'System', 'Action', 'User'],
        default: 'Action'
    },
    ipAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
