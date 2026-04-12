import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllServices } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const categories = [
    'all', 'plumbing', 'electrical',
    'tutoring', 'cleaning', 'carpentry', 'other'
];

const ServicesPage = () => {
    const [searchParams] = useSearchParams();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        keyword: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        limit: 9,
        sortBy: 'createdAt',
        order: 'desc',
    });

    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = { ...filters };
            if (params.category === 'all') delete params.category;
            if (!params.keyword) delete params.keyword;
            if (!params.location) delete params.location;
            if (!params.minPrice) delete params.minPrice;
            if (!params.maxPrice) delete params.maxPrice;

            const res = await getAllServices(params);
            setServices(res.data.data.services);
            setTotal(res.data.data.total);
            setPages(res.data.data.pages);
        } catch (err) {
            setError('Failed to fetch services.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="bg-blue-600 text-white py-12 px-4 text-center">
                <h1 className="text-4xl font-bold mb-2">All Services</h1>
                <p className="text-blue-100">
                    Find the perfect service provider near you
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 bg-white rounded-2xl shadow p-6 h-fit">
                        <h3 className="font-bold text-gray-700 mb-4 text-lg">Filters</h3>

                        <div className="mb-4">
                            <label className="text-sm text-gray-500 mb-1 block">Search</label>
                            <input
                                type="text"
                                placeholder="e.g. pipe leak fix"
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-500 mb-1 block">Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Lucknow"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-500 mb-1 block">
                                Min Price (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-500 mb-1 block">
                                Max Price (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="10000"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm text-gray-500 mb-1 block">Sort By</label>
                            <select
                                value={`${filters.sortBy}-${filters.order}`}
                                onChange={(e) => {
                                    const [sortBy, order] = e.target.value.split('-');
                                    setFilters(prev => ({ ...prev, sortBy, order, page: 1 }));
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-sm 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Top Rated</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setFilters({
                                category: 'all', keyword: '', location: '',
                                minPrice: '', maxPrice: '', page: 1,
                                limit: 9, sortBy: 'createdAt', order: 'desc'
                            })}
                            className="w-full text-sm text-red-500 hover:underline mt-2"
                        >
                            Clear Filters
                        </button>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleFilterChange('category', cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm 
                                               font-medium capitalize transition
                                        ${filters.category === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-600 border hover:border-blue-500'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Showing {services.length} of {total} services
                        </p>

                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <EmptyState
                                icon="⚠️"
                                title="Failed to load services"
                                description={error}
                                buttonLabel="Try Again"
                                onButtonClick={fetchServices}
                            />
                        ) : services.length === 0 ? (
                            <EmptyState
                                icon="🔍"
                                title="No services found"
                                description="Try adjusting your filters or search terms."
                                buttonLabel="Clear Filters"
                                onButtonClick={() => setFilters({
                                    category: 'all', keyword: '', location: '',
                                    minPrice: '', maxPrice: '', page: 1,
                                    limit: 9, sortBy: 'createdAt', order: 'desc'
                                })}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 
                                            lg:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <ServiceCard key={service._id} service={service} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                                        className={`w-9 h-9 rounded-full text-sm 
                                                   font-medium transition
                                            ${filters.page === p
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border text-gray-600 hover:border-blue-500'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;