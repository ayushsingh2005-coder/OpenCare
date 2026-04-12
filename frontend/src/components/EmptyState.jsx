import { useNavigate } from 'react-router-dom';

const EmptyState = ({
    icon = '📭',
    title = 'Nothing here yet',
    description = '',
    buttonLabel = '',
    buttonPath = '',
    onButtonClick = null,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else if (buttonPath) {
            navigate(buttonPath);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center 
                        py-20 text-center px-4">
            <div className="text-7xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-400 text-sm mb-6 max-w-sm">{description}</p>
            )}
            {(buttonLabel && (buttonPath || onButtonClick)) && (
                <button
                    onClick={handleClick}
                    className="bg-blue-600 text-white font-semibold px-6 py-2.5 
                               rounded-xl hover:bg-blue-700 transition text-sm"
                >
                    {buttonLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;