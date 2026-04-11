import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages — we'll build these in next steps
// Placeholder for now
const Home = () => <div className="p-8 text-2xl">Home Page</div>;
const Login = () => <div className="p-8 text-2xl">Login Page</div>;
const Register = () => <div className="p-8 text-2xl">Register Page</div>;
const UserDashboard = () => <div className="p-8 text-2xl">User Dashboard</div>;
const ProviderDashboard = () => <div className="p-8 text-2xl">Provider Dashboard</div>;
const NotFound = () => <div className="p-8 text-2xl">404 Not Found</div>;

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
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

      {/* User Protected Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['user']}>
            <UserDashboard />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* Provider Protected Routes */}
      <Route path="/provider/dashboard" element={
        <ProtectedRoute>
          <RoleRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </RoleRoute>
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;