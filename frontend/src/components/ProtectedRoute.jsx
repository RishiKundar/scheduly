import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

import MatrixBackground from './MatrixBackground';

export default function ProtectedRoute() {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-950 font-mono text-emerald-100 relative">
            <MatrixBackground />
            <div className="relative z-10 flex w-full h-full">
                <Sidebar />
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
