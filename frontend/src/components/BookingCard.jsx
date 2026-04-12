import { useNavigate } from 'react-router-dom';
import Badge from './Badge';

const BookingCard = ({
    booking,
    viewAs = 'user',      // 'user' or 'provider'
    onStatusUpdate,       // (bookingId, status) => void
    updating = false,
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border rounded-2xl p-5 hover:shadow-md transition">

            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {booking.service?.title || 'Service'}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize mt-0.5">
                        {booking.service?.category}
                    </p>
                </div>
                <Badge status={booking.status} />
            </div>

            {/* ── Details Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
                <div>
                    <p className="text-gray-400 text-xs mb-0.5">
                        {viewAs === 'user' ? 'Provider' : 'Customer'}
                    </p>
                    <p className="font-medium text-gray-700">
                        {viewAs === 'user'
                            ? booking.provider?.name
                            : booking.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                        {viewAs === 'user'
                            ? booking.provider?.email
                            : booking.user?.email}
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs mb-0.5">Date</p>
                    <p className="font-medium text-gray-700">
                        {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs mb-0.5">Price</p>
                    <p className="font-bold text-blue-600 text-lg">
                        ₹{booking.service?.price}
                    </p>
                </div>
            </div>

            {/* Note */}
            {booking.note && (
                <div className="bg-gray-50 rounded-xl px-4 py-2.5 mb-4">
                    <p className="text-xs text-gray-400 mb-0.5">Note</p>
                    <p className="text-sm text-gray-600">{booking.note}</p>
                </div>
            )}

            {/* ── Actions ── */}
            <div className="flex items-center justify-between flex-wrap gap-3 
                            pt-3 border-t border-gray-100">

                {/* View Service */}
                <button
                    onClick={() => navigate(`/services/${booking.service?._id}`)}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                >
                    View Service →
                </button>

                {/* Provider action buttons */}
                {viewAs === 'provider' && onStatusUpdate && (
                    <div className="flex gap-2">
                        {booking.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => onStatusUpdate(booking._id, 'accepted')}
                                    disabled={updating}
                                    className="bg-green-600 text-white text-xs font-bold 
                                               px-4 py-2 rounded-xl hover:bg-green-700 
                                               transition disabled:opacity-50"
                                >
                                    {updating ? '...' : '✅ Accept'}
                                </button>
                                <button
                                    onClick={() => onStatusUpdate(booking._id, 'rejected')}
                                    disabled={updating}
                                    className="bg-red-500 text-white text-xs font-bold 
                                               px-4 py-2 rounded-xl hover:bg-red-600 
                                               transition disabled:opacity-50"
                                >
                                    ❌ Reject
                                </button>
                            </>
                        )}
                        {booking.status === 'accepted' && (
                            <button
                                onClick={() => onStatusUpdate(booking._id, 'completed')}
                                disabled={updating}
                                className="bg-blue-600 text-white text-xs font-bold 
                                           px-4 py-2 rounded-xl hover:bg-blue-700 
                                           transition disabled:opacity-50"
                            >
                                {updating ? '...' : '🎉 Complete'}
                            </button>
                        )}
                        {(booking.status === 'completed' ||
                          booking.status === 'rejected') && (
                            <span className="text-xs text-gray-400 italic">
                                No actions available
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;