const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    let { name, email, password, role } = req.body;
    if (!role) role = 'salesperson'; // Default to salesperson
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Admin Approval Logic
        // Admin Approval Logic
        let isApproved = true; // Default: Auto-approve everyone (Buyers, Salespeople)

        if (role === 'admin') {
            isApproved = false; // Admins need manual approval
            const SUPER_ADMIN_EMAIL = 'admin@apsr.com';
            if (email === SUPER_ADMIN_EMAIL) isApproved = true;
        }

        // Generate Referral Code for Salesperson

        // Generate Referral Code for Salesperson
        let referralCode = undefined;
        if (role === 'salesperson') {
            const crypto = require('crypto');
            referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        }

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved,
            referralCode
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            if (req.io) req.io.emit('user_registered', { id: user.id, name: user.name, role: user.role });
            res.json({ token, role: user.role, name: user.name, id: user.id, referralCode: user.referralCode });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const logAudit = require('../utils/auditLogger');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            // Optional: Log failed login attempt
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (!user.isApproved) {
            return res.status(403).json({ msg: 'Account pending approval. Please wait for admin verification.' });
        }

        if (user.isSuspended) {
            return res.status(403).json({ msg: 'Account is suspended. Contact support.' });
        }

        // Log Successful Login
        await logAudit(req, {
            user: user.name,
            action: 'Login',
            target: 'System',
            details: `Logged in from IP ${req.ip}`,
            type: 'Security'
        });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name, id: user.id, referralCode: user.referralCode });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve User
router.put('/approve/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isApproved = true;
        await user.save();
        req.io.emit('user_approved', { id: user.id });

        await logAudit(req, {
            user: 'Admin', // In real app, fetch req.user.name
            action: 'Approve User',
            target: user.name,
            details: `Approved account for ${user.email}`,
            type: 'Action'
        });

        res.json({ msg: 'User approved' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Suspend/Unsuspend User
router.put('/suspend/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isSuspended = !user.isSuspended;
        await user.save();
        req.io.emit('user_registered', { id: user.id });

        await logAudit(req, {
            user: 'Admin',
            action: user.isSuspended ? 'Suspend User' : 'Unsuspend User',
            target: user.name,
            details: `${user.isSuspended ? 'Suspended' : 'Unsuspended'} account ${user.email}`,
            type: 'Security'
        });

        res.json({ msg: user.isSuspended ? 'User suspended' : 'User activated', status: user.isSuspended });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Change Tier manually
router.put('/tier/:id', async (req, res) => {
    try {
        const { tier } = req.body;
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const oldTier = user.manualTier || 'Auto';
        user.manualTier = tier || null;
        await user.save();
        req.io.emit('user_registered', { id: user.id });

        await logAudit(req, {
            user: 'Admin',
            action: 'Change Tier',
            target: user.name,
            details: `Changed tier from ${oldTier} to ${tier || 'Auto'}`,
            type: 'Action'
        });

        res.json({ msg: 'Tier updated', tier: user.manualTier });
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

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password');

        // Backfill referral code if missing (for legacy users)
        if (user && user.role === 'salesperson' && !user.referralCode) {
            const crypto = require('crypto');
            user.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Multer for Avatar
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Update Profile
router.put('/profile', [require('../middleware/auth'), upload.single('avatar')], async (req, res) => {
    const { name, password, bankDetails } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (bankDetails !== undefined) user.bankDetails = bankDetails;
        if (req.file) user.avatar = `/uploads/avatars/${req.file.filename}`;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // Log Profile Update
        await logAudit(req, {
            user: user.name,
            action: 'Update Profile',
            target: 'Self',
            details: 'Updated profile details/avatar',
            type: 'User'
        });

        res.json({ msg: 'Profile updated successfully', avatar: user.avatar });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
