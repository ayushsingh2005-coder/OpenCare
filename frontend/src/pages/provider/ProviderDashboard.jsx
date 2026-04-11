import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProviderDashboard } from '../../api/providerApi';

const ProviderDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getProviderDashboard();
                setDashboard(res.data.data);
            } catch (err) {
                setError('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-10 h-10 border-4 border-blue-500 
                            border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-red-500">{error}</div>
    );

    const { stats, recentBookings, recentReviews } = dashboard;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* ── Header ── */}
                <div className="bg-linear-to-r from-green-600 to-green-800 
                                rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">
                                Welcome, {user?.name?.split(' ')[0]} 🛠️
                            </h1>
                            <p className="text-green-100 text-sm">
                                Manage your services and bookings
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/provider/services/create')}
                                className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 
                                           rounded-xl hover:bg-yellow-300 transition text-sm"
                            >
                                + Add Service
                            </button>
                            <button
                                onClick={() => navigate('/provider/bookings')}
                                className="bg-white text-green-700 font-bold px-5 py-2 
                                           rounded-xl hover:bg-green-50 transition text-sm"
                            >
                                View Bookings
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Bookings',
                            value: stats.totalBookings,
                            icon: '📋',
                            color: 'bg-white',
                            text: 'text-gray-700'
                        },
                        {
                            label: 'Completed',
                            value: stats.completedBookings,
                            icon: '✅',
                            color: 'bg-green-50',
                            text: 'text-green-700'
                        },
                        {
                            label: 'Pending',
                            value: stats.pendingBookings,
                            icon: '⏳',
                            color: 'bg-yellow-50',
                            text: 'text-yellow-700'
                        },
                        {
                            label: 'Total Earnings',
                            value: `₹${stats.totalEarnings}`,
                            icon: '💰',
                            color: 'bg-blue-50',
                            text: 'text-blue-700'
                        },
                    ].map(card => (
                        <div key={card.label}
                             className={`${card.color} rounded-2xl shadow p-5 text-center`}>
                            <div className="text-3xl mb-2">{card.icon}</div>
                            <p className={`text-2xl font-extrabold ${card.text}`}>
                                {card.value}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Second Row Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Services',
                            value: stats.totalServices,
                            icon: '🛠️',
                        },
                        {
                            label: 'Active Services',
                            value: stats.activeServices,
                            icon: '🟢',
                        },
                        {
                            label: 'Avg Rating',
                            value: stats.averageRating
                                ? `${stats.averageRating} ★`
                                : 'No ratings yet',
                            icon: '⭐',
                        },
                    ].map(card => (
                        <div key={card.label}
                             className="bg-white rounded-2xl shadow p-5 text-center">
                            <div className="text-3xl mb-2">{card.icon}</div>
                            <p className="text-2xl font-extrabold text-gray-700">
                                {card.value}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ── Recent Bookings ── */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Recent Bookings
                            </h2>
                            <button
                                onClick={() => navigate('/provider/bookings')}
                                className="text-sm text-blue-600 hover:underline font-medium"
                            >
                                View All →
                            </button>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">📋</div>
                                <p className="text-gray-400 text-sm">No bookings yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentBookings.map(booking => (
                                    <div key={booking._id}
                                         className="flex items-center justify-between 
                                                    border rounded-xl p-3 hover:shadow-sm transition">
                                        <div>
                                            <p className="font-semibold text-gray-700 text-sm">
                                                {booking.service?.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                by {booking.user?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-semibold px-2 py-1 
                                                             rounded-full capitalize
                                                ${booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : booking.status === 'accepted'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : booking.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'}`}>
                                                {booking.status}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(booking.date).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Recent Reviews ── */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Recent Reviews
                            </h2>
                        </div>

                        {recentReviews.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">⭐</div>
                                <p className="text-gray-400 text-sm">No reviews yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentReviews.map(review => (
                                    <div key={review._id}
                                         className="border rounded-xl p-3 hover:shadow-sm transition">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-gray-700">
                                                {review.user?.name}
                                            </p>
                                            <span className="text-yellow-400 text-sm">
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            {review.service?.title}
                                        </p>
                                        <p className="text-sm text-gray-500">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Quick Links ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {[
                        {
                            title: 'My Services',
                            desc: 'View and manage your listed services',
                            icon: '🛠️',
                            path: '/provider/services',
                            color: 'bg-blue-600',
                        },
                        {
                            title: 'Manage Bookings',
                            desc: 'Accept, reject or complete bookings',
                            icon: '📅',
                            path: '/provider/bookings',
                            color: 'bg-green-600',
                        },
                        {
                            title: 'Earnings',
                            desc: 'View your monthly earnings breakdown',
                            icon: '💰',
                            path: '/provider/earnings',
                            color: 'bg-purple-600',
                        },
                    ].map(card => (
                        <button
                            key={card.title}
                            onClick={() => navigate(card.path)}
                            className={`${card.color} text-white rounded-2xl p-5 text-left 
                                       hover:opacity-90 transition shadow`}
                        >
                            <div className="text-3xl mb-3">{card.icon}</div>
                            <h3 className="font-bold text-lg">{card.title}</h3>
                            <p className="text-sm opacity-80 mt-1">{card.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;