import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-9xl font-extrabold text-blue-100 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8 text-center">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl 
                           hover:bg-blue-700 transition font-semibold"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFoundPage;