import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Name, email and password are required.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);
            const user = await register(formData);

            if (user.role === 'provider') {
                navigate('/provider/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 
                        flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                        Create Account 🚀
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Join OpenCare as a customer or service provider
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 
                                    rounded-xl px-4 py-3 text-sm mb-5">
                        {error}
                    </div>
                )}

                {/* Role Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${formData.role === 'user'
                                ? 'bg-white text-blue-600 shadow'
                                : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        👤 Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'provider' }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                            ${formData.role === 'provider'
                                ? 'bg-white text-green-600 shadow'
                                : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🛠️ Provider
                    </button>
                </div>

                {/* Role Description */}
                <div className={`rounded-xl px-4 py-3 text-xs mb-5
                    ${formData.role === 'provider'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-blue-50 text-blue-700'}`}>
                    {formData.role === 'provider'
                        ? '✅ You can list your services and accept bookings from customers.'
                        : '✅ You can browse services and book providers in your area.'}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-transparent transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                            Location <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Lucknow, UP"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-bold py-3 rounded-xl transition 
                                   disabled:opacity-50 disabled:cursor-not-allowed text-sm
                                   ${formData.role === 'provider'
                                       ? 'bg-green-600 hover:bg-green-700'
                                       : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent 
                                                 rounded-full animate-spin"></span>
                                Creating account...
                            </span>
                        ) : `Register as ${formData.role === 'provider' ? 'Provider' : 'Customer'}`}
                    </button>
                </form>

                {/* Login Link */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login"
                          className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;