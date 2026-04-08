const Review = require('../models/review.model');
const Service = require('../models/service.model');
const Booking = require('../models/booking.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (user only)
const addReview = async (req, res) => {
    try {
        const { serviceId, rating, comment } = req.body;

        if (!serviceId || !rating) {
            return errorResponse(res, 400, 'Service ID and rating are required.');
        }

        // Check service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        // Only users who completed a booking can review
        const completedBooking = await Booking.findOne({
            user: req.user._id,
            service: serviceId,
            status: 'completed',
        });

        if (!completedBooking) {
            return errorResponse(
                res,
                403,
                'You can only review a service after a completed booking.'
            );
        }

        // Check already reviewed
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            service: serviceId,
        });

        if (alreadyReviewed) {
            return errorResponse(res, 400, 'You have already reviewed this service.');
        }

        const review = await Review.create({
            user: req.user._id,
            service: serviceId,
            rating,
            comment,
        });

        await review.populate('user', 'name email');

        // calcAverageRating fires automatically via post save hook
        return successResponse(res, 201, 'Review added successfully.', { review });
    } catch (err) {
        if (err.code === 11000) {
            return errorResponse(res, 400, 'You have already reviewed this service.');
        }
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all reviews for a service
// @route   GET /api/reviews/service/:id
// @access  Public
const getServiceReviews = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        const reviews = await Review.find({ service: req.params.id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return successResponse(res, 200, 'Reviews fetched successfully.', {
            count: reviews.length,
            averageRating: service.rating,
            numReviews: service.numReviews,
            reviews,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return errorResponse(res, 404, 'Review not found.');
        }

        const isOwner = review.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return errorResponse(res, 403, 'Not authorized to delete this review.');
        }

        await review.deleteOne();

        // calcAverageRating fires automatically via post findOneAndDelete hook

        return successResponse(res, 200, 'Review deleted successfully.', {});
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = { addReview, getServiceReviews, deleteReview };