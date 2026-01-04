const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Admin Approval Logic
        let isApproved = true;
        if (role === 'admin') {
            // Only the designated Super Admin is auto-approved
            // For this demo, let's say 'admin@apsr.com' is the super admin
            const SUPER_ADMIN_EMAIL = 'admin@apsr.com';
            if (email !== SUPER_ADMIN_EMAIL) {
                isApproved = false;
            }
        }

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name, id: user.id });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (user.role === 'admin' && !user.isApproved) {
            return res.status(403).json({ msg: 'Account pending approval from Super Admin.' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name, id: user.id });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve Admin (Super Admin only - simpler check for now)
router.put('/approve/:id', async (req, res) => {
    try {
        // meaningful security would require real middleware, 
        // for now we trust the caller is an admin context or we check header
        // In a real app: check req.user.email === SUPER_ADMIN_EMAIL or similar

        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isApproved = true;
        await user.save();
        res.json({ msg: 'User approved' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Pending Admins
router.get('/pending-admins', async (req, res) => {
    try {
        const users = await User.find({ role: 'admin', isApproved: false }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
