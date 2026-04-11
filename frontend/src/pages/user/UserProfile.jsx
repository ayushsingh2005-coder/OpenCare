import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const UserProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        location: user?.location || '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (formData.password && formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);
            const payload = { name: formData.name, location: formData.location };
            if (formData.password) payload.password = formData.password;

            await API.put('/users/profile', payload);
            setSuccess('Profile updated successfully! ✅');
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-xl mx-auto">

                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow p-8">

                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center 
                                        justify-center text-white text-3xl font-bold mb-3">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <span className="mt-2 bg-blue-100 text-blue-700 text-xs 
                                         font-semibold px-3 py-1 rounded-full capitalize">
                            {user?.role}
                        </span>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 
                                        rounded-xl px-4 py-3 text-sm mb-5">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 
                                        rounded-xl px-4 py-3 text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                           text-sm focus:outline-none focus:ring-2 
                                           focus:ring-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full border border-gray-100 bg-gray-50 rounded-xl 
                                           px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
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

                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">
                                New Password{' '}
                                <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min 6 characters"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 
                                           text-sm focus:outline-none focus:ring-2 
                                           focus:ring-blue-500 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl 
                                       hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white 
                                                     border-t-transparent rounded-full animate-spin">
                                    </span>
                                    Saving...
                                </span>
                            ) : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;