const Booking = require('../models/booking.model');
const Service = require('../models/service.model');
const Review = require('../models/review.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get provider dashboard stats
// @route   GET /api/providers/dashboard
// @access  Private (provider only)
const getProviderDashboard = async (req, res) => {
    try {
        const providerId = req.user._id;

        // All bookings for this provider
        const allBookings = await Booking.find({ provider: providerId });

        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
        const acceptedBookings = allBookings.filter(b => b.status === 'accepted').length;
        const completedBookings = allBookings.filter(b => b.status === 'completed').length;
        const rejectedBookings = allBookings.filter(b => b.status === 'rejected').length;

        // Total earnings — sum price of all completed bookings
        const completedBookingIds = allBookings
            .filter(b => b.status === 'completed')
            .map(b => b.service);

        const completedServices = await Service.find({
            _id: { $in: completedBookingIds },
        });

        const totalEarnings = completedServices.reduce(
            (sum, service) => sum + service.price, 0
        );

        // All services by this provider
        const myServices = await Service.find({ provider: providerId });
        const totalServices = myServices.length;
        const activeServices = myServices.filter(s => s.isActive).length;

        // Average rating across all services
        const ratings = myServices
            .filter(s => s.numReviews > 0)
            .map(s => s.rating);

        const averageRating =
            ratings.length > 0
                ? Math.round(
                      (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10
                  ) / 10
                : 0;

        // Recent 5 bookings
        const recentBookings = await Booking.find({ provider: providerId })
            .populate('service', 'title price')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent 5 reviews across all provider services
        const serviceIds = myServices.map(s => s._id);
        const recentReviews = await Review.find({ service: { $in: serviceIds } })
            .populate('user', 'name email')
            .populate('service', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        return successResponse(res, 200, 'Dashboard fetched successfully.', {
            stats: {
                totalBookings,
                pendingBookings,
                acceptedBookings,
                completedBookings,
                rejectedBookings,
                totalEarnings,
                totalServices,
                activeServices,
                averageRating,
            },
            recentBookings,
            recentReviews,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all services by logged in provider
// @route   GET /api/providers/my-services
// @access  Private (provider only)
const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ provider: req.user._id })
            .sort({ createdAt: -1 });

        return successResponse(res, 200, 'Your services fetched successfully.', {
            count: services.length,
            services,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get provider earnings breakdown month wise
// @route   GET /api/providers/earnings
// @access  Private (provider only)
const getEarningsBreakdown = async (req, res) => {
    try {
        const providerId = req.user._id;

        const completedBookings = await Booking.find({
            provider: providerId,
            status: 'completed',
        }).populate('service', 'title price');

        // Group earnings by month
        const monthlyEarnings = {};

        completedBookings.forEach(booking => {
            const month = new Date(booking.date).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });

            if (!monthlyEarnings[month]) {
                monthlyEarnings[month] = {
                    month,
                    totalEarnings: 0,
                    bookingCount: 0,
                };
            }

            monthlyEarnings[month].totalEarnings += booking.service?.price || 0;
            monthlyEarnings[month].bookingCount += 1;
        });

        const breakdown = Object.values(monthlyEarnings).sort(
            (a, b) => new Date(a.month) - new Date(b.month)
        );

        const totalEarnings = breakdown.reduce(
            (sum, m) => sum + m.totalEarnings, 0
        );

        return successResponse(res, 200, 'Earnings breakdown fetched successfully.', {
            totalEarnings,
            breakdown,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = {
    getProviderDashboard,
    getMyServices,
    getEarningsBreakdown,
};