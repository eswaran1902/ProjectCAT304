const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check DB for suspension
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'User validation failed' });
        }
        if (user.isSuspended) {
            return res.status(403).json({ msg: 'Account suspended' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
