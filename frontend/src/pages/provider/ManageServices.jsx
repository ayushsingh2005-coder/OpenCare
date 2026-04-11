import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyServices } from '../../api/providerApi';
import { deleteService, updateService } from '../../api/serviceApi';

const ManageServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchServices = async () => {
        try {
            const res = await getMyServices();
            setServices(res.data.data.services);
        } catch (err) {
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await deleteService(id);
            setServices(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            alert('Failed to delete service.');
        }
    };

    const handleToggleActive = async (service) => {
        try {
            await updateService(service._id, { isActive: !service.isActive });
            setServices(prev =>
                prev.map(s => s._id === service._id
                    ? { ...s, isActive: !s.isActive }
                    : s
                )
            );
        } catch (err) {
            alert('Failed to update service.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <button
                            onClick={() => navigate('/provider/dashboard')}
                            className="text-blue-600 hover:underline text-sm mb-1 
                                       flex items-center gap-1"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">My Services</h1>
                    </div>
                    <button
                        onClick={() => navigate('/provider/services/create')}
                        className="bg-green-600 text-white font-bold px-5 py-2 
                                   rounded-xl hover:bg-green-700 transition text-sm"
                    >
                        + Add New Service
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 
                                        border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow">
                        <div className="text-6xl mb-4">🛠️</div>
                        <p className="text-gray-400 text-lg mb-4">
                            No services listed yet.
                        </p>
                        <button
                            onClick={() => navigate('/provider/services/create')}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl 
                                       hover:bg-green-700 transition font-semibold text-sm"
                        >
                            Create Your First Service
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {services.map(service => (
                            <div key={service._id}
                                 className="bg-white rounded-2xl shadow p-5 
                                            hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {service.title}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold
                                                ${service.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-600'}`}>
                                                {service.isActive ? '🟢 Active' : '🔴 Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                            {service.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="bg-blue-50 text-blue-700 
                                                             px-3 py-1 rounded-full text-xs capitalize">
                                                {service.category}
                                            </span>
                                            <span className="text-gray-500">
                                                💰 ₹{service.price}
                                            </span>
                                            <span className="text-gray-500">
                                                📍 {service.location}
                                            </span>
                                            <span className="text-yellow-500">
                                                ★ {service.rating || '0.0'} 
                                                ({service.numReviews} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => handleToggleActive(service)}
                                            className={`text-xs font-semibold px-3 py-1.5 
                                                       rounded-lg transition
                                                ${service.isActive
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                        >
                                            {service.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => navigate(
                                                `/provider/services/edit/${service._id}`
                                            )}
                                            className="text-xs font-semibold px-3 py-1.5 
                                                       rounded-lg bg-blue-50 text-blue-600 
                                                       hover:bg-blue-100 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="text-xs font-semibold px-3 py-1.5 
                                                       rounded-lg bg-red-50 text-red-600 
                                                       hover:bg-red-100 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageServices;