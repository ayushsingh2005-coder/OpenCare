const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return errorResponse(res, 404, 'User not found.');
        }
        return successResponse(res, 200, 'Profile fetched successfully.', { user });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Update logged in user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, location, password } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return errorResponse(res, 404, 'User not found.');
        }

        // Only update fields that were actually sent
        if (name) user.name = name;
        if (location) user.location = location;

        // If password update — bcrypt pre-save hook will hash it
        if (password) {
            if (password.length < 6) {
                return errorResponse(res, 400, 'Password must be at least 6 characters.');
            }
            user.password = password;
        }

        const updatedUser = await user.save();

        return successResponse(res, 200, 'Profile updated successfully.', {
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                location: updatedUser.location,
                isVerified: updatedUser.isVerified,
            },
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all providers
// @route   GET /api/users/providers
// @access  Public
const getProviders = async (req, res) => {
    try {
        const { location, name } = req.query;

        // Build filter dynamically
        const filter = { role: 'provider' };

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const providers = await User.find(filter).select(
            '_id name email location role isVerified createdAt'
        );

        return successResponse(res, 200, 'Providers fetched successfully.', {
            count: providers.length,
            providers,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = { getProfile, updateProfile, getProviders };