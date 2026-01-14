const AuditLog = require('../models/AuditLog');

const logAudit = async (req, { user, action, target, details, type }) => {
    try {
        const newLog = new AuditLog({
            user: user || 'System',
            action,
            target,
            details,
            type: type || 'System',
            ipAddress: req?.ip || '127.0.0.1'
        });

        await newLog.save();

        // Emit real-time event if io is available
        if (req && req.io) {
            req.io.emit('audit_log', newLog);
        }

        return newLog;
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};

module.exports = logAudit;
