const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
}, { timestamps: true });

// One review per user per service
reviewSchema.index({ user: 1, service: 1 }, { unique: true });

// Auto-update service rating after a review is saved
reviewSchema.statics.calcAverageRating = async function (serviceId) {
    const stats = await this.aggregate([
        { $match: { service: serviceId } },
        {
            $group: {
                _id: '$service',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await mongoose.model('Service').findByIdAndUpdate(serviceId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews,
        });
    } else {
        await mongoose.model('Service').findByIdAndUpdate(serviceId, {
            rating: 0,
            numReviews: 0,
        });
    }
};

// Trigger after save
reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.service);
});

// Trigger after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRating(doc.service);
    }
});

module.exports = mongoose.model('Review', reviewSchema);