const StarRating = ({ rating, size = 'md', interactive = false, onRate }) => {
    const sizes = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl',
    };

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    onClick={() => interactive && onRate && onRate(star)}
                    className={`${sizes[size]} transition
                        ${interactive
                            ? 'cursor-pointer hover:scale-125'
                            : 'cursor-default'}
                        ${star <= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;