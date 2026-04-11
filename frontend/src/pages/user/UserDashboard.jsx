import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings } from '../../api/bookingApi';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const statusIcons = {
    pending: '⏳',
    accepted: '✅',
    completed: '🎉',
    rejected: '❌',
};

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getMyBookings();
                setBookings(res.data.data.bookings);
            } catch (err) {
                setError('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const filtered = activeTab === 'all'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">

                {/* ── Welcome Header ── */}
                <div className="bg-linear-to-r from-blue-600 to-blue-800 
                                rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">
                                Hello, {user?.name?.split(' ')[0]} 👋
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Manage your bookings and explore services
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 
                                       rounded-xl hover:bg-yellow-300 transition text-sm"
                        >
                            + Book a Service
                        </button>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', count: counts.all, color: 'bg-white', text: 'text-gray-700' },
                        { label: 'Pending', count: counts.pending, color: 'bg-yellow-50', text: 'text-yellow-700' },
                        { label: 'Accepted', count: counts.accepted, color: 'bg-blue-50', text: 'text-blue-700' },
                        { label: 'Completed', count: counts.completed, color: 'bg-green-50', text: 'text-green-700' },
                    ].map(card => (
                        <div key={card.label}
                             className={`${card.color} rounded-2xl shadow p-4 text-center`}>
                            <p className={`text-3xl font-extrabold ${card.text}`}>
                                {card.count}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Bookings Section ── */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['all', 'pending', 'accepted', 'completed', 'rejected'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition
                                    ${activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {tab} ({counts[tab]})
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-4 border-blue-500 
                                            border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-400 text-lg">No bookings found.</p>
                            <button
                                onClick={() => navigate('/services')}
                                className="mt-4 bg-blue-600 text-white px-6 py-2 
                                           rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                            >
                                Browse Services
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(booking => (
                                <div key={booking._id}
                                     className="border rounded-2xl p-5 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {booking.service?.title || 'Service'}
                                            </h3>
                                            <p className="text-sm text-gray-400 capitalize">
                                                {booking.service?.category}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 
                                                         rounded-full capitalize
                                                         ${statusColors[booking.status]}`}>
                                            {statusIcons[booking.status]} {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-400 text-xs">Provider</p>
                                            <p className="font-medium text-gray-700">
                                                {booking.provider?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Date</p>
                                            <p className="font-medium text-gray-700">
                                                {new Date(booking.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-xs">Price</p>
                                            <p className="font-bold text-blue-600">
                                                ₹{booking.service?.price}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.note && (
                                        <div className="mt-3 bg-gray-50 rounded-xl px-4 py-2">
                                            <p className="text-xs text-gray-400">Your Note</p>
                                            <p className="text-sm text-gray-600">{booking.note}</p>
                                        </div>
                                    )}

                                    {/* View Service button */}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => navigate(`/services/${booking.service?._id}`)}
                                            className="text-blue-600 text-sm font-semibold hover:underline"
                                        >
                                            View Service →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Profile Card ── */}
                <div className="bg-white rounded-2xl shadow p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                        <button
                            onClick={() => navigate('/user/profile')}
                            className="text-sm text-blue-600 font-semibold hover:underline"
                        >
                            Edit Profile →
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center 
                                        justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                            <p className="text-gray-400 text-sm">
                                📍 {user?.location || 'Location not set'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;