const Spinner = ({ size = 'md', color = 'blue', fullScreen = false }) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };

    const colors = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        white: 'border-white',
    };

    const spinner = (
        <div className={`${sizes[size]} ${colors[color]} 
                        border-t-transparent rounded-full animate-spin`}>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-16">
            {spinner}
        </div>
    );
};

export default Spinner;