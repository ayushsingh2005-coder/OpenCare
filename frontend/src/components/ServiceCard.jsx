import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import Badge from './Badge';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/services/${service._id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition 
                       cursor-pointer overflow-hidden border-2 border-transparent 
                       hover:border-blue-200 group"
        >
            {/* Top color bar */}
            <div className="bg-linear-to-r from-blue-500 to-blue-700 
                            h-2 w-full group-hover:from-blue-600 
                            group-hover:to-blue-800 transition">
            </div>

            <div className="p-5">
                {/* Category + Rating */}
                <div className="flex items-center justify-between mb-3">
                    <Badge status={service.category} showIcon={false} />
                    <div className="flex items-center gap-1">
                        <StarRating rating={service.rating || 0} size="sm" />
                        <span className="text-xs text-gray-400">
                            ({service.numReviews})
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-1 
                               group-hover:text-blue-600 transition line-clamp-1">
                    {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {service.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 
                                border-t border-gray-100">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                            ₹{service.price}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            📍 {service.location}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">
                            {service.provider?.name}
                        </p>
                        <p className="text-xs text-green-500 font-medium mt-0.5">
                            {service.isActive ? 'Available' : 'Unavailable'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;