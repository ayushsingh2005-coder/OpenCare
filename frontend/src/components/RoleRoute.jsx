import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent 
                                rounded-full animate-spin">
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user?.role)) {
        // Redirect to their correct dashboard
        if (user?.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
        if (user?.role === 'user') return <Navigate to="/user/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;