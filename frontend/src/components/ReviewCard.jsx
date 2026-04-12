import { useAuth } from '../context/AuthContext';
import { deleteReview } from '../api/reviewApi';
import StarRating from './StarRating';

const ReviewCard = ({ review, onDelete }) => {
    const { user } = useAuth();

    const isOwner = user?._id === review.user?._id;
    const isAdmin = user?.role === 'admin';

    const handleDelete = async () => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await deleteReview(review._id);
            onDelete(review._id);
        } catch (err) {
            alert('Failed to delete review.');
        }
    };

    return (
        <div className="border rounded-2xl p-5 hover:shadow-md transition bg-white">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center 
                                    justify-center text-white font-bold text-sm shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">
                            {review.user?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    {(isOwner || isAdmin) && (
                        <button
                            onClick={handleDelete}
                            className="text-red-400 hover:text-red-600 
                                       text-xs font-medium ml-2 transition"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {review.comment && (
                <p className="text-gray-600 text-sm leading-relaxed pl-13">
                    {review.comment}
                </p>
            )}
        </div>
    );
};

export default ReviewCard;