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
        <div className="w-64 bg-gray-950/80 backdrop-blur-md border-r border-emerald-500/20 text-emerald-100 flex flex-col shadow-[0_0_20px_rgba(16,185,129,0.05)] relative z-10">
            <div className="p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        {'>_'}
                    </div>
                    <span className="text-xl font-bold tracking-widest uppercase text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                        Scheduly
                    </span>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4 font-mono text-sm uppercase tracking-widest">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-4 py-3 rounded border transition-all ${
                                isActive 
                                ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]' 
                                : 'border-transparent text-emerald-600 hover:text-emerald-400 hover:bg-emerald-950/30'
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-emerald-500/20 font-mono text-sm uppercase tracking-widest">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-500 hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent transition-all"
                >
                    Disconnect
                </button>
            </div>
        </div>
    );
}
