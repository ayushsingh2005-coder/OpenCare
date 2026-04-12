const configs = {
    pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: '⏳',
    },
    accepted: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: '✅',
    },
    completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: '🎉',
    },
    rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: '❌',
    },
    active: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: '🟢',
    },
    inactive: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: '🔴',
    },
    user: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: '👤',
    },
    provider: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: '🛠️',
    },
    admin: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: '👑',
    },
};

const Badge = ({ status, showIcon = true }) => {
    const config = configs[status] || {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: '•',
    };

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold 
                         px-3 py-1 rounded-full capitalize
                         ${config.bg} ${config.text}`}>
            {showIcon && <span>{config.icon}</span>}
            {status}
        </span>
    );
};

export default Badge;