const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role, location } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return errorResponse(res, 400, 'Name, email and password are required.');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'Email already registered.');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            location,
        });

        const token = generateToken(user._id, user.role);

        return successResponse(res, 201, 'Registration successful.', {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
            },
        });

    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Email and password are required.');
        }

        // Explicitly select password since select:false in model
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password.');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 401, 'Invalid email or password.');
        }

        const token = generateToken(user._id, user.role);

        return successResponse(res, 200, 'Login successful.', {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
            },
        });

    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        return successResponse(res, 200, 'User fetched successfully.', { user });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = { register, login, getMe };