import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../api/serviceApi';
import { getServiceReviews } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../api/bookingApi';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNote, setBookingNote] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingMsg, setBookingMsg] = useState('');
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceRes, reviewRes] = await Promise.all([
                    getServiceById(id),
                    getServiceReviews(id),
                ]);
                setService(serviceRes.data.data.service);
                setReviews(reviewRes.data.data.reviews);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBooking = async () => {
        if (!bookingDate) {
            setBookingError('Please select a date.');
            return;
        }
        try {
            setBookingLoading(true);
            setBookingError('');
            await createBooking({
                serviceId: id,
                date: bookingDate,
                note: bookingNote,
            });
            setBookingMsg('Booking created successfully! ✅');
            setBookingDate('');
            setBookingNote('');
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Booking failed.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent 
                            rounded-full animate-spin"></div>
        </div>
    );

    if (!service) return (
        <div className="text-center py-20 text-gray-500">Service not found.</div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate('/services')}
                    className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
                >
                    ← Back to Services
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* ── Service Info ── */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold 
                                             px-3 py-1 rounded-full uppercase">
                                {service.category}
                            </span>
                            <span className="text-yellow-500 font-semibold">
                                ★ {service.rating || '0.0'} ({service.numReviews} reviews)
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.title}</h1>
                        <p className="text-gray-500 mb-6 leading-relaxed">{service.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="text-2xl font-bold text-blue-600">₹{service.price}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="text-lg font-semibold text-gray-700">
                                    📍 {service.location}
                                </p>
                            </div>
                        </div>

                        {/* Provider Info */}
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-1">Service Provider</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center 
                                                justify-center text-white font-bold">
                                    {service.provider?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {service.provider?.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        📍 {service.provider?.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Booking Card ── */}
                    <div className="bg-white rounded-2xl shadow p-6 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Book This Service</h3>

                        {!isAuthenticated ? (
                            <div className="text-center">
                                <p className="text-gray-500 text-sm mb-4">
                                    Login to book this service
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl 
                                               hover:bg-blue-700 transition font-semibold"
                                >
                                    Login to Book
                                </button>
                            </div>
                        ) : user?.role !== 'user' ? (
                            <p className="text-sm text-gray-400 text-center">
                                Only customers can book services.
                            </p>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-500 mb-1 block">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="w-full border rounded-xl px-3 py-2 text-sm 
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm text-gray-500 mb-1 block">
                                        Note (optional)
                                    </label>
                                    <textarea
                                        value={bookingNote}
                                        onChange={(e) => setBookingNote(e.target.value)}
                                        placeholder="Any special instructions..."
                                        rows={3}
                                        className="w-full border rounded-xl px-3 py-2 text-sm 
                                                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {bookingMsg && (
                                    <p className="text-green-600 text-sm mb-3 font-medium">
                                        {bookingMsg}
                                    </p>
                                )}
                                {bookingError && (
                                    <p className="text-red-500 text-sm mb-3">{bookingError}</p>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl 
                                               hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                                >
                                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div className="mt-8 bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-3">⭐</div>
                            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review._id}
                                     className="border rounded-xl p-4 hover:shadow-sm transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center 
                                                            justify-center text-blue-600 font-bold text-sm">
                                                {review.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-700 text-sm">
                                                {review.user?.name}
                                            </span>
                                        </div>
                                        <div className="text-yellow-400 font-semibold text-sm">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;