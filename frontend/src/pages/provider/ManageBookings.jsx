import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderBookings, updateBookingStatus } from '../../api/bookingApi';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const ManageBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);

    const fetchBookings = async () => {
        try {
            const res = await getProviderBookings();
            setBookings(res.data.data.bookings);
        } catch (err) {
            setError('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleStatus = async (bookingId, status) => {
        try {
            setUpdating(bookingId);
            await updateBookingStatus(bookingId, status);
            setBookings(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status } : b)
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        } finally {
            setUpdating(null);
        }
    };

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

                <div className="mb-6">
                    <button
                        onClick={() => navigate('/provider/dashboard')}
                        className="text-blue-600 hover:underline text-sm mb-1 
                                   flex items-center gap-1"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['all', 'pending', 'accepted', 'completed', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium 
                                       capitalize transition
                                ${activeTab === tab
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-600 border hover:border-green-500'}`}
                        >
                            {tab} ({counts[tab]})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-green-500 
                                        border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-400">No bookings found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(booking => (
                            <div key={booking._id}
                                 className="bg-white rounded-2xl shadow p-5 
                                            hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">
                                            {booking.service?.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Customer: {booking.user?.name} •{' '}
                                            {booking.user?.email}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 
                                                     rounded-full capitalize
                                                     ${statusColors[booking.status]}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 
                                                text-sm mb-4">
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
                                        <p className="font-bold text-green-600">
                                            ₹{booking.service?.price}
                                        </p>
                                    </div>
                                    {booking.note && (
                                        <div>
                                            <p className="text-gray-400 text-xs">Note</p>
                                            <p className="font-medium text-gray-600">
                                                {booking.note}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatus(booking._id, 'accepted')}
                                                disabled={updating === booking._id}
                                                className="bg-green-600 text-white text-sm 
                                                           font-semibold px-4 py-2 rounded-xl 
                                                           hover:bg-green-700 transition 
                                                           disabled:opacity-50"
                                            >
                                                {updating === booking._id
                                                    ? 'Updating...' : '✅ Accept'}
                                            </button>
                                            <button
                                                onClick={() => handleStatus(booking._id, 'rejected')}
                                                disabled={updating === booking._id}
                                                className="bg-red-500 text-white text-sm 
                                                           font-semibold px-4 py-2 rounded-xl 
                                                           hover:bg-red-600 transition 
                                                           disabled:opacity-50"
                                            >
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'accepted' && (
                                        <button
                                            onClick={() => handleStatus(booking._id, 'completed')}
                                            disabled={updating === booking._id}
                                            className="bg-blue-600 text-white text-sm 
                                                       font-semibold px-4 py-2 rounded-xl 
                                                       hover:bg-blue-700 transition 
                                                       disabled:opacity-50"
                                        >
                                            {updating === booking._id
                                                ? 'Updating...' : '🎉 Mark Completed'}
                                        </button>
                                    )}
                                    {(booking.status === 'completed' ||
                                      booking.status === 'rejected') && (
                                        <span className="text-sm text-gray-400 italic">
                                            No actions available
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;