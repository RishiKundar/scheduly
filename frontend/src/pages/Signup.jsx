import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MatrixBackground from '../components/MatrixBackground';
import api from '../api/axiosConfig';
import { Terminal, Shield, Lock, Mail, User } from 'lucide-react';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/user', formData);
            // After successful signup, redirect to login
            navigate('/login', { state: { message: 'System access granted. Please initialize your session.' } });
        } catch (err) {
            setError(err.response?.data || 'Failed to create system operator access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-mono">
            <MatrixBackground />
            
            <div className="relative z-10 w-full max-w-md p-8 bg-gray-950/80 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)] mb-4">
                        <Terminal className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-emerald-400 tracking-wider uppercase">Initialize</h2>
                    <p className="text-emerald-500/60 mt-2 text-sm uppercase tracking-widest">Register New Operator</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg flex items-start">
                        <Shield className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-emerald-500 mb-2 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-emerald-600" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-emerald-500/30 rounded-lg leading-5 bg-gray-900/50 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                placeholder="operator@matrix.net"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-emerald-500 mb-2 uppercase tracking-wider">Passphrase</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-emerald-600" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-emerald-500/30 rounded-lg leading-5 bg-gray-900/50 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-emerald-500 mb-2 uppercase tracking-wider">Clearance Level</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-emerald-600" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-3 border border-emerald-500/30 rounded-lg leading-5 bg-gray-900/50 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="USER">Standard Operator (USER)</option>
                                <option value="ADMIN">System Architect (ADMIN)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-emerald-500 rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-gray-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        {loading ? 'Processing...' : 'Establish Connection'}
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-emerald-600 text-sm">
                        Session already active?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all">
                            Authenticate Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
