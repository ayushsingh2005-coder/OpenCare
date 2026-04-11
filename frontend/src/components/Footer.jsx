import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h2 className="text-white text-xl font-bold mb-2">
                        Open<span className="text-blue-400">Care</span>
                    </h2>
                    <p className="text-sm">
                        Connecting you with trusted local service providers in your neighbourhood.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                        <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                        <li><Link to="/register" className="hover:text-white transition">Become a Provider</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li>🔧 Plumbing</li>
                        <li>⚡ Electrical</li>
                        <li>📚 Tutoring</li>
                        <li>🧹 Cleaning</li>
                        <li>🪵 Carpentry</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
                © 2026 OpenCare. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;