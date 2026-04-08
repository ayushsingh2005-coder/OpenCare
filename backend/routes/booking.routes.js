const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
} = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// User routes
router.post('/', authMiddleware, roleMiddleware('user'), createBooking);
router.get('/my-bookings', authMiddleware, roleMiddleware('user'), getMyBookings);

// Provider routes
router.get('/provider', authMiddleware, roleMiddleware('provider'), getProviderBookings);
router.put('/:id/status', authMiddleware, roleMiddleware('provider'), updateBookingStatus);

module.exports = router;