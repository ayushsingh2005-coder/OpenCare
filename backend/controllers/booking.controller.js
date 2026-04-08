const Booking = require('../models/booking.model');
const Service = require('../models/service.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (user only)
const createBooking = async (req, res) => {
    try {
        const { serviceId, date, note } = req.body;

        if (!serviceId || !date) {
            return errorResponse(res, 400, 'Service ID and date are required.');
        }

        // Check service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        // User cannot book their own service
        if (service.provider.toString() === req.user._id.toString()) {
            return errorResponse(res, 400, 'You cannot book your own service.');
        }

        // Check double booking — same user, same service, same date
        const existingBooking = await Booking.findOne({
            user: req.user._id,
            service: serviceId,
            date: new Date(date),
        });

        if (existingBooking) {
            return errorResponse(res, 400, 'You have already booked this service for this date.');
        }

        const booking = await Booking.create({
            user: req.user._id,
            provider: service.provider,
            service: serviceId,
            date: new Date(date),
            note,
        });

        await booking.populate([
            { path: 'service', select: 'title category price location' },
            { path: 'provider', select: 'name email location' },
        ]);

        return successResponse(res, 201, 'Booking created successfully.', { booking });
    } catch (err) {
        // Handle mongoose duplicate key error (compound index)
        if (err.code === 11000) {
            return errorResponse(res, 400, 'You have already booked this service for this date.');
        }
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all bookings of logged in user
// @route   GET /api/bookings/my-bookings
// @access  Private (user)
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('service', 'title category price location')
            .populate('provider', 'name email location')
            .sort({ createdAt: -1 });

        return successResponse(res, 200, 'Your bookings fetched successfully.', {
            count: bookings.length,
            bookings,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all bookings received by provider
// @route   GET /api/bookings/provider
// @access  Private (provider)
const getProviderBookings = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = { provider: req.user._id };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('service', 'title category price location')
            .populate('user', 'name email location')
            .sort({ createdAt: -1 });

        return successResponse(res, 200, 'Provider bookings fetched successfully.', {
            count: bookings.length,
            bookings,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (provider)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedTransitions = {
            pending: ['accepted', 'rejected'],
            accepted: ['completed'],
            rejected: [],
            completed: [],
        };

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return errorResponse(res, 404, 'Booking not found.');
        }

        // Only the provider of this booking can update status
        if (booking.provider.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to update this booking.');
        }

        // Validate status transition
        const allowed = allowedTransitions[booking.status];
        if (!allowed.includes(status)) {
            return errorResponse(
                res,
                400,
                `Cannot transition from '${booking.status}' to '${status}'.`
            );
        }

        booking.status = status;
        await booking.save();

        await booking.populate([
            { path: 'service', select: 'title category price location' },
            { path: 'user', select: 'name email' },
        ]);

        return successResponse(res, 200, `Booking ${status} successfully.`, { booking });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
};