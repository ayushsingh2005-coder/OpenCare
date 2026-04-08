const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { errorResponse } = require('../utils/apiResponse');

const authMiddleware = async (req, res, next) => {
    try {
        let token;
        // console.log("AUTH HEADER:", req.headers.authorization);

        if (req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(res, 401, 'Access denied. No token provided.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return errorResponse(res, 401, 'User no longer exists.');
        }

        req.user = user;
        next();

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return errorResponse(res, 401, 'Invalid token.');
        }
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Token expired. Please login again.');
        }
        return errorResponse(res, 500, 'Authentication error.');
    }
};

module.exports = authMiddleware;