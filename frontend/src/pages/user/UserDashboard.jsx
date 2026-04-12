import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookings } from '../../api/bookingApi';
import BookingCard from '../../components/BookingCard';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import Badge from '../../components/Badge';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        getMyBookings()
            .then(res => setBookings(res.data.data.bookings))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
    };

    const filtered = activeTab === 'all'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-blue-800 
                                rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
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
                            className="bg-yellow-400 text-gray-900 font-bold px-5 
                                       py-2 rounded-xl hover:bg-yellow-300 transition text-sm"
                        >
                            + Book a Service
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', count: counts.all, color: 'text-gray-700' },
                        { label: 'Pending', count: counts.pending, color: 'text-yellow-600' },
                        { label: 'Accepted', count: counts.accepted, color: 'text-blue-600' },
                        { label: 'Completed', count: counts.completed, color: 'text-green-600' },
                    ].map(card => (
                        <div key={card.label}
                             className="bg-white rounded-2xl shadow p-4 text-center">
                            <p className={`text-3xl font-extrabold ${card.color}`}>
                                {card.count}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bookings */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookings</h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['all', 'pending', 'accepted', 'completed', 'rejected'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-sm 
                                           font-medium capitalize transition
                                    ${activeTab === tab
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {tab} ({counts[tab]})
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <Spinner />
                    ) : filtered.length === 0 ? (
                        <EmptyState
                            icon="📋"
                            title="No bookings found"
                            description="You haven't made any bookings yet."
                            buttonLabel="Browse Services"
                            buttonPath="/services"
                        />
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(booking => (
                                <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                    viewAs="user"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Card */}
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
                            <div className="mt-1">
                                <Badge status={user?.role} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;