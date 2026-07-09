const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware 1: Protect routes (Verify JWT)
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check for token in the secure HttpOnly cookie
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // Fallback: Check standard Authorization header just in case (useful for Postman testing)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. If no token is found, kick them out
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user in the database and attach them to the request object
        req.user = await User.findById(decoded.id);
        
        next(); // Pass control to the next middleware or controller
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
};

// Middleware 2: Role-Based Access Control (RBAC)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the logged-in user's role is in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user.role}' is strictly forbidden from accessing this route`
            });
        }
        next();
    };
};