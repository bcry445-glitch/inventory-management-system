const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'allied_internship_super_secret_key_2026', {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// === THE FIX IS HERE: Added 'next' to the parameter list ===
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user in database
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Send token response
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error); // This now works without crashing!
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// === THE FIX IS HERE: Added 'next' to the parameter list ===
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Find user and explicitly select the password field we hid earlier
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Send token response
        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error); // This now works without crashing!
    }
};