import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }

        try {
            setLoading(true);
            const user = await login(formData);

            // Redirect based on role
            if (user.role === 'provider') {
                navigate('/provider/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Try again.');
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
                        Welcome Back 👋
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Login to your OpenCare account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 
                                    rounded-xl px-4 py-3 text-sm mb-5">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            placeholder="••••••••"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                                       focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl 
                                   hover:bg-blue-700 transition disabled:opacity-50 
                                   disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent 
                                                 rounded-full animate-spin"></span>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register"
                          className="text-blue-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;