import { useState } from 'react';
import { addReview } from '../api/reviewApi';
import StarRating from './StarRating';

const ReviewForm = ({ serviceId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hovered, setHovered] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }

        try {
            setLoading(true);
            const res = await addReview({ serviceId, rating, comment });
            setSuccess('Review submitted successfully! ✅');
            setRating(0);
            setComment('');
            onReviewAdded(res.data.data.review);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setLoading(false);
        }
    };

    const labels = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent',
    };

    return (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                ✍️ Write a Review
            </h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 
                                rounded-xl px-4 py-3 text-sm mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 
                                rounded-xl px-4 py-3 text-sm mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Interactive Star Rating */}
                <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                className={`text-4xl cursor-pointer transition-transform 
                                           hover:scale-125 select-none
                                    ${star <= (hovered || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                        {(hovered || rating) > 0 && (
                            <span className="text-sm font-medium text-gray-500 ml-2">
                                {labels[hovered || rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                        Comment{' '}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Share your experience with this service..."
                        className="w-full border border-gray-200 bg-white rounded-xl 
                                   px-4 py-3 text-sm focus:outline-none focus:ring-2 
                                   focus:ring-blue-500 transition resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right mt-1">
                        {comment.length}/500
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl 
                               hover:bg-blue-700 transition disabled:opacity-50 
                               disabled:cursor-not-allowed text-sm"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white 
                                             border-t-transparent rounded-full animate-spin">
                            </span>
                            Submitting...
                        </span>
                    ) : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;