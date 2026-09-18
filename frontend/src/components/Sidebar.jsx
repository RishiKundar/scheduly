import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Create Job', path: '/create-job' },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">S</div>
                    <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Scheduly
                    </span>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-4 py-3 rounded-lg transition-colors ${
                                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
