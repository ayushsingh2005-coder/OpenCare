import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Open<span className="text-gray-800">Care</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link to="/services" className="hover:text-blue-600 transition">Services</Link>

                    {isAuthenticated && user?.role === 'user' && (
                        <Link to="/user/dashboard" className="hover:text-blue-600 transition">
                            My Bookings
                        </Link>
                    )}

                    {isAuthenticated && user?.role === 'provider' && (
                        <>
                            <Link to="/provider/dashboard" className="hover:text-blue-600 transition">
                                Dashboard
                            </Link>
                            <Link to="/provider/services" className="hover:text-blue-600 transition">
                                My Services
                            </Link>
                            <Link to="/provider/bookings" className="hover:text-blue-600 transition">
                                Bookings
                            </Link>
                        </>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-blue-600 text-white text-sm px-4 py-2 
                                           rounded-lg hover:bg-blue-700 transition"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 hidden md:block">
                                Hi, {user?.name?.split(' ')[0]} 👋
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium
                                ${user?.role === 'provider'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'}`}>
                                {user?.role}
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white text-sm px-4 py-2 
                                           rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;