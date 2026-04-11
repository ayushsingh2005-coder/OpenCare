import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService, updateService } from '../../api/serviceApi';
import { getServiceById } from '../../api/serviceApi';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const categories = [
    'plumbing', 'electrical', 'tutoring',
    'cleaning', 'carpentry', 'other'
];

const CreateService = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // if id exists = edit mode
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'plumbing',
        price: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditMode);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // If edit mode — prefill form
    useEffect(() => {
        if (isEditMode) {
            const fetchService = async () => {
                try {
                    const res = await getServiceById(id);
                    const s = res.data.data.service;
                    setFormData({
                        title: s.title,
                        description: s.description,
                        category: s.category,
                        price: s.price,
                        location: s.location,
                    });
                } catch (err) {
                    setError('Failed to load service.');
                } finally {
                    setFetchLoading(false);
                }
            };
            fetchService();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title || !formData.description ||
            !formData.price || !formData.location) {
            setError('All fields are required.');
            return;
        }

        try {
            setLoading(true);
            if (isEditMode) {
                await updateService(id, formData);
                setSuccess('Service updated successfully! ✅');
            } else {
                await createService(formData);
                setSuccess('Service created successfully! ✅');
                setFormData({
                    title: '', description: '',
                    category: 'plumbing', price: '', location: ''
                });
            }
            setTimeout(() => navigate('/provider/services'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-10 h-10 border-4 border-blue-500 
                            border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                <button
                    onClick={() => navigate('/provider/services')}
                    className="text-blue-600 hover:underline text-sm mb-6 
                               flex items-center gap-1"
                >
                    ← Back to My Services
                </button>

                <div className="bg-white rounded-2xl shadow p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        {isEditMode ? '✏️ Edit Service' : '➕ Create New Service'}
                    </h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 
                                        rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 
                                        rounded-xl px-4 py-3 text-sm mb-5">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                Service Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Home Plumbing Repair"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                           text-sm focus:outline-none focus:ring-2 
                                           focus:ring-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe your service in detail..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                           text-sm focus:outline-none focus:ring-2 
                                           focus:ring-blue-500 transition resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                               text-sm focus:outline-none focus:ring-2 
                                               focus:ring-blue-500 transition capitalize"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">
                                    Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g. 500"
                                    min="0"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                               text-sm focus:outline-none focus:ring-2 
                                               focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Lucknow, UP"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                           text-sm focus:outline-none focus:ring-2 
                                           focus:ring-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-bold py-3 
                                       rounded-xl hover:bg-green-700 transition 
                                       disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white 
                                                     border-t-transparent rounded-full animate-spin">
                                    </span>
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : isEditMode ? 'Update Service' : 'Create Service'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateService;