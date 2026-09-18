import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function ProtectedRoute() {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 overflow-auto p-8">
                <Outlet />
            </div>
        </div>
    );
}
