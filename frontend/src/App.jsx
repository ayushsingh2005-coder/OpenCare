import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Placeholders for next steps
const Login = () => <div className="p-8 text-2xl">Login Page</div>;
const Register = () => <div className="p-8 text-2xl">Register Page</div>;
const UserDashboard = () => <div className="p-8 text-2xl">User Dashboard</div>;
const ProviderDashboard = () => <div className="p-8 text-2xl">Provider Dashboard</div>;

function App() {
    const { isAuthenticated, user } = useAuth();

    return (
        <Layout>
            <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />

                <Route path="/login" element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'provider'
                            ? '/provider/dashboard'
                            : '/user/dashboard'} replace />
                        : <Login />
                } />
                <Route path="/register" element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'provider'
                            ? '/provider/dashboard'
                            : '/user/dashboard'} replace />
                        : <Register />
                } />

                {/* User Protected */}
                <Route path="/user/dashboard" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </RoleRoute>
                    </ProtectedRoute>
                } />

                {/* Provider Protected */}
                <Route path="/provider/dashboard" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <ProviderDashboard />
                        </RoleRoute>
                    </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
}

export default App;