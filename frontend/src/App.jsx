import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageServices from './pages/provider/ManageServices';
import CreateService from './pages/provider/CreateService';
import ManageBookings from './pages/provider/ManageBookings';

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
                        : <LoginPage />
                } />
                <Route path="/register" element={
                    isAuthenticated
                        ? <Navigate to={user?.role === 'provider'
                            ? '/provider/dashboard'
                            : '/user/dashboard'} replace />
                        : <RegisterPage />
                } />

                {/* ── User Routes ── */}
                <Route path="/user/dashboard" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/user/profile" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['user']}>
                            <UserProfile />
                        </RoleRoute>
                    </ProtectedRoute>
                } />

                {/* ── Provider Routes ── */}
                <Route path="/provider/dashboard" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <ProviderDashboard />
                        </RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/provider/services" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <ManageServices />
                        </RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/provider/services/create" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <CreateService />
                        </RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/provider/services/edit/:id" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <CreateService />
                        </RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/provider/bookings" element={
                    <ProtectedRoute>
                        <RoleRoute allowedRoles={['provider']}>
                            <ManageBookings />
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