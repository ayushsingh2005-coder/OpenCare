import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { dark, toggle } = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLink = (path, label) => (
        <Link
            to={path}
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-medium transition-colors duration-200
                ${isActive(path)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-stone-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400'}`}
        >
            {label}
        </Link>
    );

    return (
        <nav style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
        }}
            className="sticky top-0 z-50 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg gradient-green flex items-center 
                                        justify-center text-white font-black text-sm">
                            O
                        </div>
                        <span className="text-lg font-bold"
                              style={{ color: 'var(--text-primary)' }}>
                            Open<span className="text-green-600">Care</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav Links ── */}
                    <div className="hidden md:flex items-center gap-7">
                        {navLink('/services', 'Services')}

                        {isAuthenticated && user?.role === 'user' && (
                            <>
                                {navLink('/user/dashboard', 'Dashboard')}
                                {navLink('/user/profile', 'Profile')}
                            </>
                        )}

                        {isAuthenticated && user?.role === 'provider' && (
                            <>
                                {navLink('/provider/dashboard', 'Dashboard')}
                                {navLink('/provider/services', 'My Services')}
                                {navLink('/provider/bookings', 'Bookings')}
                            </>
                        )}
                    </div>

                    {/* ── Right Side ── */}
                    <div className="hidden md:flex items-center gap-3">

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggle}
                            className="w-9 h-9 rounded-lg flex items-center justify-center 
                                       transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                            }}
                            title={dark ? 'Light Mode' : 'Dark Mode'}
                        >
                            {dark ? '☀️' : '🌙'}
                        </button>

                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn-outline text-sm py-2 px-4"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="btn-primary text-sm py-2 px-4"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* User Avatar + Name */}
                                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg"
                                     style={{ background: 'var(--bg-secondary)' }}>
                                    <div className="w-7 h-7 rounded-full gradient-green flex 
                                                    items-center justify-center text-white 
                                                    text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold leading-none"
                                           style={{ color: 'var(--text-primary)' }}>
                                            {user?.name?.split(' ')[0]}
                                        </p>
                                        <p className="text-xs capitalize mt-0.5"
                                           style={{ color: 'var(--text-muted)' }}>
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="text-sm font-semibold px-4 py-2 rounded-lg 
                                               transition-all duration-200"
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = '#fef2f2';
                                        e.currentTarget.style.color = '#dc2626';
                                        e.currentTarget.style.borderColor = '#fecaca';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'var(--bg-secondary)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Mobile Right ── */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggle}
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            {dark ? '☀️' : '🌙'}
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-9 h-9 rounded-lg flex flex-col items-center 
                                       justify-center gap-1.5"
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <span className={`block w-5 h-0.5 transition-all duration-300
                                ${menuOpen
                                    ? 'rotate-45 translate-y-2 bg-green-600'
                                    : 'bg-stone-500 dark:bg-slate-400'}`}>
                            </span>
                            <span className={`block w-5 h-0.5 transition-all duration-300
                                ${menuOpen
                                    ? 'opacity-0'
                                    : 'bg-stone-500 dark:bg-slate-400'}`}>
                            </span>
                            <span className={`block w-5 h-0.5 transition-all duration-300
                                ${menuOpen
                                    ? '-rotate-45 -translate-y-2 bg-green-600'
                                    : 'bg-stone-500 dark:bg-slate-400'}`}>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 pt-2 space-y-1"
                     style={{ borderTop: '1px solid var(--border)' }}>

                    <MobileLink to="/services" label="Services"
                                active={isActive('/services')}
                                onClick={() => setMenuOpen(false)} />

                    {isAuthenticated && user?.role === 'user' && (
                        <>
                            <MobileLink to="/user/dashboard" label="Dashboard"
                                        active={isActive('/user/dashboard')}
                                        onClick={() => setMenuOpen(false)} />
                            <MobileLink to="/user/profile" label="Profile"
                                        active={isActive('/user/profile')}
                                        onClick={() => setMenuOpen(false)} />
                        </>
                    )}

                    {isAuthenticated && user?.role === 'provider' && (
                        <>
                            <MobileLink to="/provider/dashboard" label="Dashboard"
                                        active={isActive('/provider/dashboard')}
                                        onClick={() => setMenuOpen(false)} />
                            <MobileLink to="/provider/services" label="My Services"
                                        active={isActive('/provider/services')}
                                        onClick={() => setMenuOpen(false)} />
                            <MobileLink to="/provider/bookings" label="Bookings"
                                        active={isActive('/provider/bookings')}
                                        onClick={() => setMenuOpen(false)} />
                        </>
                    )}

                    <div className="pt-3 flex flex-col gap-2"
                         style={{ borderTop: '1px solid var(--border)' }}>
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => { navigate('/login'); setMenuOpen(false); }}
                                    className="btn-outline w-full text-center"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { navigate('/register'); setMenuOpen(false); }}
                                    className="btn-primary w-full text-center"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full gradient-green flex 
                                                    items-center justify-center text-white 
                                                    text-sm font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold"
                                           style={{ color: 'var(--text-primary)' }}>
                                            {user?.name}
                                        </p>
                                        <p className="text-xs capitalize"
                                           style={{ color: 'var(--text-muted)' }}>
                                            {user?.role}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { logout(); setMenuOpen(false); }}
                                    className="text-sm font-semibold text-red-500 
                                               hover:text-red-600 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Mobile Link Component
const MobileLink = ({ to, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${active
                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
        style={{ color: active ? undefined : 'var(--text-secondary)' }}
    >
        {label}
    </Link>
);

export default Navbar;