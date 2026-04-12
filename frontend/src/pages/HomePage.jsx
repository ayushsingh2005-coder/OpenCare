import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllServices } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';

const categories = [
    { icon: '🔧', label: 'Plumbing', value: 'plumbing', desc: 'Pipes, leaks & drainage' },
    { icon: '⚡', label: 'Electrical', value: 'electrical', desc: 'Wiring & installations' },
    { icon: '📚', label: 'Tutoring', value: 'tutoring', desc: 'Home & online classes' },
    { icon: '🧹', label: 'Cleaning', value: 'cleaning', desc: 'Deep & regular cleaning' },
    { icon: '🪵', label: 'Carpentry', value: 'carpentry', desc: 'Furniture & woodwork' },
    { icon: '✂️', label: 'Barber', value: 'other', desc: 'Haircuts at your door' },
    { icon: '👔', label: 'Ironing', value: 'other', desc: 'Clothes ironing service' },
    { icon: '🛠️', label: 'More', value: 'other', desc: 'Other local services' },
];

const steps = [
    {
        step: '01',
        icon: '🔍',
        title: 'Search & Discover',
        desc: 'Browse verified local service providers by category, location or keyword.',
    },
    {
        step: '02',
        icon: '📅',
        title: 'Book Instantly',
        desc: 'Pick a date, add a note and confirm your booking in under 60 seconds.',
    },
    {
        step: '03',
        icon: '⭐',
        title: 'Get it Done & Rate',
        desc: 'Provider arrives, completes the job. Leave a review to help the community.',
    },
];

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Homeowner, Lucknow',
        text: 'Found a plumber in 10 minutes. Professional and affordable. OpenCare is a game changer!',
        rating: 5,
        avatar: 'P',
    },
    {
        name: 'Rohit Verma',
        role: 'Business Owner, Kanpur',
        text: 'Listed my electrical services and got 3 bookings the same day. Amazing platform!',
        rating: 5,
        avatar: 'R',
    },
    {
        name: 'Ananya Singh',
        role: 'Student, Lucknow',
        text: 'Booked a home tutor for my younger brother in minutes. Great experience overall.',
        rating: 5,
        avatar: 'A',
    },
];

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getAllServices({ limit: 6, sortBy: 'rating', order: 'desc' })
            .then(res => setFeaturedServices(res.data.data.services))
            .catch(() => {})
            .finally(() => setLoadingServices(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?keyword=${searchQuery}`);
        } else {
            navigate('/services');
        }
    };

    return (
        <div style={{ background: 'var(--bg-primary)' }}>

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 gradient-green opacity-95"></div>
                <div className="absolute inset-0"
                     style={{
                         backgroundImage: `radial-gradient(circle at 20% 50%, 
                             rgba(255,255,255,0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, 
                             rgba(249,115,22,0.15) 0%, transparent 40%)`,
                     }}>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 
                                            rounded-full text-xs font-semibold mb-6 glass"
                                 style={{ color: 'rgba(255,255,255,0.9)' }}>
                                <span className="w-2 h-2 rounded-full bg-green-300 
                                                 animate-pulse"></span>
                                Your Neighbourhood, Your Services
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black 
                                           text-white leading-tight mb-6">
                                Connect with <br />
                                <span className="text-yellow-300">Local Service</span>
                                <br />Providers
                            </h1>

                            <p className="text-lg text-green-100 mb-8 leading-relaxed 
                                          max-w-lg">
                                From plumbers to tutors, find trusted professionals in your 
                                area. Book services, read reviews, and get things done.
                            </p>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch}
                                  className="flex gap-2 mb-8 max-w-lg">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for plumber, tutor, barber..."
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium
                                               outline-none text-stone-800 placeholder-stone-400"
                                    style={{ background: 'rgba(255,255,255,0.95)' }}
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl font-bold text-sm 
                                               transition-all duration-200 hover:opacity-90
                                               hover:-translate-y-0.5"
                                    style={{
                                        background: 'var(--orange-accent)',
                                        color: 'white',
                                    }}
                                >
                                    Search
                                </button>
                            </form>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate('/services')}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl 
                                               font-semibold text-sm bg-white text-green-700 
                                               hover:bg-green-50 transition-all duration-200
                                               hover:-translate-y-0.5 shadow-lg"
                                >
                                    Browse Services →
                                </button>

                                {!isAuthenticated && (
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl 
                                                   font-semibold text-sm glass text-white
                                                   hover:bg-white/20 transition-all duration-200"
                                    >
                                        Become a Provider
                                    </button>
                                )}

                                {isAuthenticated && (
                                    <button
                                        onClick={() => navigate(
                                            user?.role === 'provider'
                                                ? '/provider/dashboard'
                                                : '/user/dashboard'
                                        )}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl 
                                                   font-semibold text-sm glass text-white
                                                   hover:bg-white/20 transition-all duration-200"
                                    >
                                        Go to Dashboard
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right — Stats Card */}
                        <div className="hidden md:block">
                            <div className="glass rounded-2xl p-8 text-white">
                                <h3 className="text-lg font-bold mb-6 text-green-100">
                                    Platform Overview
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Providers', value: '500+', icon: '👷' },
                                        { label: 'Categories', value: '8+', icon: '📦' },
                                        { label: 'Bookings Done', value: '2K+', icon: '✅' },
                                        { label: 'Support', value: '24x7', icon: '💬' },
                                    ].map(stat => (
                                        <div key={stat.label}
                                             className="bg-white/10 rounded-xl p-4 
                                                        hover:bg-white/20 transition">
                                            <div className="text-2xl mb-2">{stat.icon}</div>
                                            <div className="text-2xl font-black text-yellow-300">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-green-100 mt-1">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Verified badge */}
                                <div className="mt-6 flex items-center gap-3 bg-white/10 
                                                rounded-xl p-3">
                                    <div className="w-10 h-10 rounded-full bg-green-400/30 
                                                    flex items-center justify-center text-xl">
                                        ✓
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Verified Providers
                                        </p>
                                        <p className="text-xs text-green-200">
                                            All providers are background checked
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ── */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest 
                                      text-green-600 mb-2">
                            What We Offer
                        </p>
                        <h2 className="section-title mb-3">Browse by Category</h2>
                        <p className="section-subtitle max-w-xl mx-auto">
                            From home repairs to personal services — find everything 
                            your neighbourhood needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => navigate(`/services?category=${cat.value}`)}
                                className="card card-lift p-4 flex flex-col items-center 
                                           gap-2 text-center group cursor-pointer"
                            >
                                <span className="text-3xl group-hover:scale-110 
                                                 transition-transform duration-200">
                                    {cat.icon}
                                </span>
                                <span className="text-xs font-bold"
                                      style={{ color: 'var(--text-primary)' }}>
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURED SERVICES ── */}
            <section className="py-16 px-4"
                     style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest 
                                          text-green-600 mb-2">
                                Top Rated
                            </p>
                            <h2 className="section-title">Featured Services</h2>
                        </div>
                        <button
                            onClick={() => navigate('/services')}
                            className="text-sm font-semibold text-green-600 
                                       hover:text-green-700 transition hidden sm:block"
                        >
                            View all →
                        </button>
                    </div>

                    {loadingServices ? (
                        <Spinner color="green" />
                    ) : featuredServices.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                No services yet. Be the first to list one!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featuredServices.map(service => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8 sm:hidden">
                        <button
                            onClick={() => navigate('/services')}
                            className="btn-primary"
                        >
                            View All Services
                        </button>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold uppercase tracking-widest 
                                      text-green-600 mb-2">
                            Simple Process
                        </p>
                        <h2 className="section-title mb-3">How It Works</h2>
                        <p className="section-subtitle">
                            Get your service done in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 
                                        h-0.5 bg-green-100 z-0"></div>

                        {steps.map((s, i) => (
                            <div key={s.step}
                                 className="card p-6 text-center relative z-10 card-lift">
                                <div className="w-16 h-16 rounded-2xl gradient-green flex 
                                                items-center justify-center text-2xl mx-auto 
                                                mb-4 shadow-lg">
                                    {s.icon}
                                </div>
                                <div className="text-xs font-black text-green-200 
                                                tracking-widest mb-2">
                                    STEP {s.step}
                                </div>
                                <h3 className="text-lg font-bold mb-2"
                                    style={{ color: 'var(--text-primary)' }}>
                                    {s.title}
                                </h3>
                                <p className="text-sm leading-relaxed"
                                   style={{ color: 'var(--text-secondary)' }}>
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-16 px-4"
                     style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest 
                                      text-green-600 mb-2">
                            What People Say
                        </p>
                        <h2 className="section-title mb-3">Loved by the Community</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <div key={i} className="card card-lift p-6">
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-sm">★</span>
                                    ))}
                                </div>

                                <p className="text-sm leading-relaxed mb-5 italic"
                                   style={{ color: 'var(--text-secondary)' }}>
                                    "{t.text}"
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full gradient-green 
                                                    flex items-center justify-center 
                                                    text-white font-bold text-sm">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold"
                                           style={{ color: 'var(--text-primary)' }}>
                                            {t.name}
                                        </p>
                                        <p className="text-xs"
                                           style={{ color: 'var(--text-muted)' }}>
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROVIDER CTA ── */}
            {!isAuthenticated && (
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="gradient-green rounded-3xl p-10 md:p-14 
                                        text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full 
                                            bg-white/5 -translate-y-1/2 translate-x-1/4">
                            </div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full 
                                            bg-black/10 translate-y-1/2 -translate-x-1/4">
                            </div>
                            <div className="relative">
                                <p className="text-xs font-bold uppercase tracking-widest 
                                              text-green-200 mb-3">
                                    For Service Providers
                                </p>
                                <h2 className="text-3xl md:text-4xl font-black mb-4">
                                    Grow Your Business <br />
                                    with OpenCare
                                </h2>
                                <p className="text-green-100 mb-8 max-w-xl mx-auto">
                                    List your services for free. Get discovered by thousands 
                                    of customers in your area. Start earning more today.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-8 py-3 rounded-xl font-bold text-sm 
                                                   bg-white text-green-700 hover:bg-green-50 
                                                   transition-all hover:-translate-y-0.5 shadow-lg"
                                    >
                                        Register as Provider →
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-8 py-3 rounded-xl font-bold text-sm 
                                                   glass text-white hover:bg-white/20 
                                                   transition-all"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;