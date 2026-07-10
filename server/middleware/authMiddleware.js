const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user associated with the token (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            // Pass control to the exact next function in the route!
            return next();
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token failed' 
            });
        }
    }

    // If no token is found at all
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token provided' 
        });
    }
};