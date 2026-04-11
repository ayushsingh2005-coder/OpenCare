import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = [
    { icon: '🔧', label: 'Plumbing', value: 'plumbing' },
    { icon: '⚡', label: 'Electrical', value: 'electrical' },
    { icon: '📚', label: 'Tutoring', value: 'tutoring' },
    { icon: '🧹', label: 'Cleaning', value: 'cleaning' },
    { icon: '🪵', label: 'Carpentry', value: 'carpentry' },
    { icon: '🛠️', label: 'Other', value: 'other' },
];

const steps = [
    { step: '01', title: 'Search Services', desc: 'Browse services by category, location or keyword.' },
    { step: '02', title: 'Book a Provider', desc: 'Pick a date and book your preferred service provider.' },
    { step: '03', title: 'Get it Done', desc: 'Provider arrives and completes the job. Rate your experience.' },
];

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen">

            {/* ── Hero Section ── */}
            <section className="bg-linear-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Find Trusted Local <br />
                        <span className="text-yellow-300">Service Providers</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Connect with verified plumbers, electricians, tutors and more
                        in your neighbourhood — quickly and reliably.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 
                                       rounded-xl hover:bg-yellow-300 transition text-lg"
                        >
                            Browse Services
                        </button>
                        {!isAuthenticated && (
                            <button
                                onClick={() => navigate('/register')}
                                className="border-2 border-white text-white font-bold px-8 py-3 
                                           rounded-xl hover:bg-white hover:text-blue-700 transition text-lg"
                            >
                                Become a Provider
                            </button>
                        )}
                        {isAuthenticated && user?.role === 'user' && (
                            <button
                                onClick={() => navigate('/user/dashboard')}
                                className="border-2 border-white text-white font-bold px-8 py-3 
                                           rounded-xl hover:bg-white hover:text-blue-700 transition text-lg"
                            >
                                My Bookings
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Categories Section ── */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Browse by Category
                    </h2>
                    <p className="text-center text-gray-500 mb-10">
                        Find the right service for your needs
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => navigate(`/services?category=${cat.value}`)}
                                className="bg-white rounded-2xl shadow hover:shadow-md p-6 flex flex-col 
                                           items-center gap-3 hover:border-blue-500 border-2 border-transparent 
                                           transition cursor-pointer"
                            >
                                <span className="text-4xl">{cat.icon}</span>
                                <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        How It Works
                    </h2>
                    <p className="text-center text-gray-500 mb-12">
                        Get your service done in 3 simple steps
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((s) => (
                            <div key={s.step} className="text-center p-6 rounded-2xl bg-blue-50">
                                <div className="text-5xl font-extrabold text-blue-200 mb-4">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h3>
                                <p className="text-gray-500 text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="py-16 px-4 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-5xl font-extrabold text-yellow-300 mb-2">500+</div>
                        <div className="text-blue-100 font-medium">Service Providers</div>
                    </div>
                    <div>
                        <div className="text-5xl font-extrabold text-yellow-300 mb-2">2000+</div>
                        <div className="text-blue-100 font-medium">Bookings Completed</div>
                    </div>
                    <div>
                        <div className="text-5xl font-extrabold text-yellow-300 mb-2">4.8★</div>
                        <div className="text-blue-100 font-medium">Average Rating</div>
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            {!isAuthenticated && (
                <section className="py-16 px-4 bg-gray-50 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Join hundreds of providers and customers on OpenCare today.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-blue-600 text-white font-bold px-8 py-3 
                                       rounded-xl hover:bg-blue-700 transition"
                        >
                            Sign Up Free
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 
                                       rounded-xl hover:bg-blue-50 transition"
                        >
                            Login
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;