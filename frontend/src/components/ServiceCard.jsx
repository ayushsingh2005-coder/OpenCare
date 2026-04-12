import { useNavigate } from 'react-router-dom';

const categoryColors = {
    plumbing: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
    electrical: { bg: '#fefce8', text: '#a16207', dot: '#eab308' },
    tutoring: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
    cleaning: { bg: '#fdf4ff', text: '#7e22ce', dot: '#a855f7' },
    carpentry: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
    other: { bg: '#f8fafc', text: '#475569', dot: '#94a3b8' },
};

const categoryIcons = {
    plumbing: '🔧',
    electrical: '⚡',
    tutoring: '📚',
    cleaning: '🧹',
    carpentry: '🪵',
    other: '🛠️',
};

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();
    const colors = categoryColors[service.category] || categoryColors.other;
    const icon = categoryIcons[service.category] || '🛠️';

    return (
        <div
            onClick={() => navigate(`/services/${service._id}`)}
            className="card card-lift cursor-pointer group overflow-hidden"
        >
            {/* ── Top Bar ── */}
            <div className="h-1.5 w-full"
                 style={{ background: colors.dot }}>
            </div>

            <div className="p-5">
                {/* ── Header Row ── */}
                <div className="flex items-start justify-between mb-4">
                    {/* Category Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs 
                                    font-semibold capitalize"
                         style={{ background: colors.bg, color: colors.text }}>
                        <span>{icon}</span>
                        {service.category}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-xs font-semibold"
                              style={{ color: 'var(--text-primary)' }}>
                            {service.rating > 0
                                ? service.rating.toFixed(1)
                                : 'New'}
                        </span>
                        {service.numReviews > 0 && (
                            <span className="text-xs"
                                  style={{ color: 'var(--text-muted)' }}>
                                ({service.numReviews})
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Title ── */}
                <h3 className="text-base font-bold mb-1.5 line-clamp-1 
                               group-hover:text-green-600 transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}>
                    {service.title}
                </h3>

                {/* ── Description ── */}
                <p className="text-sm line-clamp-2 mb-4 leading-relaxed"
                   style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                </p>

                {/* ── Divider ── */}
                <div className="h-px mb-4"
                     style={{ background: 'var(--border)' }}>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xl font-black text-green-600">
                            ₹{service.price}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs"
                                  style={{ color: 'var(--text-muted)' }}>
                                📍
                            </span>
                            <span className="text-xs"
                                  style={{ color: 'var(--text-muted)' }}>
                                {service.location}
                            </span>
                        </div>
                    </div>

                    <div className="text-right">
                        {/* Provider Avatar */}
                        <div className="flex items-center gap-2 justify-end">
                            <div>
                                <p className="text-xs font-semibold text-right"
                                   style={{ color: 'var(--text-primary)' }}>
                                    {service.provider?.name?.split(' ')[0]}
                                </p>
                                <p className="text-xs"
                                   style={{ color: service.isActive
                                       ? '#16a34a' : 'var(--text-muted)' }}>
                                    {service.isActive ? '● Available' : '○ Unavailable'}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full gradient-green flex 
                                            items-center justify-center text-white 
                                            text-xs font-bold shrink-0">
                                {service.provider?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── View Button — appears on hover ── */}
                <div className="mt-4 overflow-hidden h-0 group-hover:h-9 
                                transition-all duration-300">
                    <div className="btn-primary w-full text-center text-xs py-2">
                        View Details →
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;