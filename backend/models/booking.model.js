const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
    },
    note: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Prevent double booking:
// same user cannot book the same service on the same date
bookingSchema.index({ user: 1, service: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);