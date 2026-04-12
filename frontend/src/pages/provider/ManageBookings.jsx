import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderBookings, updateBookingStatus } from '../../api/bookingApi';
import BookingCard from '../../components/BookingCard';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const ManageBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        getProviderBookings()
            .then(res => setBookings(res.data.data.bookings))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleStatus = async (bookingId, status) => {
        try {
            setUpdating(bookingId);
            await updateBookingStatus(bookingId, status);
            setBookings(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status } : b)
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update.');
        } finally {
            setUpdating(null);
        }
    };

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

                <div className="mb-6">
                    <button
                        onClick={() => navigate('/provider/dashboard')}
                        className="text-blue-600 hover:underline text-sm mb-1 
                                   flex items-center gap-1"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Bookings
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['all', 'pending', 'accepted', 'completed', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm 
                                       font-medium capitalize transition
                                ${activeTab === tab
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-600 border hover:border-green-500'}`}
                        >
                            {tab} ({counts[tab]})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Spinner color="green" />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="No bookings found"
                        description="You haven't received any bookings yet."
                    />
                ) : (
                    <div className="space-y-4">
                        {filtered.map(booking => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                viewAs="provider"
                                onStatusUpdate={handleStatus}
                                updating={updating === booking._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;