const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
    commissionRate: {
        type: Number,
        default: 10
    },
    commissionCap: {
        type: Number,
        default: 500
    },
    autoApproveLowRisk: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
