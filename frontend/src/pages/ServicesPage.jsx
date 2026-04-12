import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllServices } from '../api/serviceApi';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const categories = [
    { label: 'All', value: 'all', icon: '✨' },
    { label: 'Plumbing', value: 'plumbing', icon: '🔧' },
    { label: 'Electrical', value: 'electrical', icon: '⚡' },
    { label: 'Tutoring', value: 'tutoring', icon: '📚' },
    { label: 'Cleaning', value: 'cleaning', icon: '🧹' },
    { label: 'Carpentry', value: 'carpentry', icon: '🪵' },
    { label: 'Other', value: 'other', icon: '🛠️' },
];

const ServicesPage = () => {
    const [searchParams] = useSearchParams();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        keyword: searchParams.get('keyword') || '',
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

    const handleFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            category: 'all', keyword: '', location: '',
            minPrice: '', maxPrice: '', page: 1,
            limit: 9, sortBy: 'createdAt', order: 'desc',
        });
    };

    const activeFiltersCount = [
        filters.category !== 'all',
        filters.keyword,
        filters.location,
        filters.minPrice,
        filters.maxPrice,
    ].filter(Boolean).length;

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

            {/* ── Page Header ── */}
            <div className="gradient-green py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-widest 
                                  text-green-200 mb-2">
                        Discover
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        All Services
                    </h1>

                    {/* Inline Search */}
                    <div className="flex gap-2 max-w-xl">
                        <input
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => handleFilter('keyword', e.target.value)}
                            placeholder="Search plumber, tutor, barber..."
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none
                                       text-stone-800 placeholder-stone-400"
                            style={{ background: 'rgba(255,255,255,0.95)' }}
                        />
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden flex items-center gap-2 px-4 py-2.5 
                                       rounded-xl text-sm font-semibold glass text-white"
                        >
                            Filters {activeFiltersCount > 0 && (
                                <span className="bg-orange-400 text-white text-xs 
                                                 w-5 h-5 rounded-full flex items-center 
                                                 justify-center font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Category Pills ── */}
            <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => handleFilter('category', cat.value)}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full 
                                           text-xs font-semibold whitespace-nowrap transition-all 
                                           duration-200 flex-shrink-0"
                                style={{
                                    background: filters.category === cat.value
                                        ? 'var(--green-primary)'
                                        : 'var(--bg-secondary)',
                                    color: filters.category === cat.value
                                        ? 'white'
                                        : 'var(--text-secondary)',
                                    border: `1px solid ${filters.category === cat.value
                                        ? 'var(--green-primary)'
                                        : 'var(--border)'}`,
                                }}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-6">

                    {/* ── Filters Sidebar ── */}
                    <aside className={`
                        ${sidebarOpen ? 'block' : 'hidden'} md:block
                        w-full md:w-60 flex-shrink-0
                    `}>
                        <div className="card p-5 sticky top-20">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-sm"
                                    style={{ color: 'var(--text-primary)' }}>
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-semibold text-red-500 
                                                   hover:text-red-600 transition"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Location */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold uppercase 
                                                  tracking-wide mb-2 block"
                                       style={{ color: 'var(--text-muted)' }}>
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Lucknow"
                                    value={filters.location}
                                    onChange={(e) => handleFilter('location', e.target.value)}
                                    className="input-field text-xs"
                                />
                            </div>

                            {/* Price Range */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold uppercase 
                                                  tracking-wide mb-2 block"
                                       style={{ color: 'var(--text-muted)' }}>
                                    Price Range (₹)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilter('minPrice', e.target.value)}
                                        className="input-field text-xs w-1/2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilter('maxPrice', e.target.value)}
                                        className="input-field text-xs w-1/2"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold uppercase 
                                                  tracking-wide mb-2 block"
                                       style={{ color: 'var(--text-muted)' }}>
                                    Sort By
                                </label>
                                <select
                                    value={`${filters.sortBy}-${filters.order}`}
                                    onChange={(e) => {
                                        const [sortBy, order] = e.target.value.split('-');
                                        setFilters(prev => ({
                                            ...prev, sortBy, order, page: 1
                                        }));
                                    }}
                                    className="input-field text-xs"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="createdAt-asc">Oldest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating-desc">Top Rated</option>
                                </select>
                            </div>

                            {/* Active filters summary */}
                            {activeFiltersCount > 0 && (
                                <div className="mt-4 p-3 rounded-lg text-xs"
                                     style={{
                                         background: 'var(--green-light)',
                                         color: 'var(--green-primary)',
                                     }}>
                                    {activeFiltersCount} filter{activeFiltersCount > 1
                                        ? 's' : ''} active
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <div className="flex-1 min-w-0">

                        {/* Results Bar */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm font-medium"
                               style={{ color: 'var(--text-secondary)' }}>
                                {loading ? 'Loading...' : (
                                    <>
                                        <span className="font-bold"
                                              style={{ color: 'var(--text-primary)' }}>
                                            {total}
                                        </span>
                                        {' '}services found
                                    </>
                                )}
                            </p>

                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden text-xs font-semibold px-3 py-1.5 
                                           rounded-lg transition"
                                style={{
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border)',
                                }}
                            >
                                {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <Spinner color="green" />
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
                                onButtonClick={clearFilters}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 
                                                xl:grid-cols-3 gap-5">
                                    {services.map(service => (
                                        <ServiceCard key={service._id} service={service} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => handleFilter('page', filters.page - 1)}
                                            disabled={filters.page === 1}
                                            className="px-4 py-2 rounded-lg text-sm font-medium 
                                                       transition disabled:opacity-30"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            ← Prev
                                        </button>

                                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => handleFilter('page', p)}
                                                className="w-9 h-9 rounded-lg text-sm 
                                                           font-semibold transition"
                                                style={{
                                                    background: filters.page === p
                                                        ? 'var(--green-primary)'
                                                        : 'var(--bg-card)',
                                                    color: filters.page === p
                                                        ? 'white'
                                                        : 'var(--text-secondary)',
                                                    border: `1px solid ${filters.page === p
                                                        ? 'var(--green-primary)'
                                                        : 'var(--border)'}`,
                                                }}
                                            >
                                                {p}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handleFilter('page', filters.page + 1)}
                                            disabled={filters.page === pages}
                                            className="px-4 py-2 rounded-lg text-sm font-medium 
                                                       transition disabled:opacity-30"
                                            style={{
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;