import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, CheckCircle, AlertCircle, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axiosConfig';

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [jobsRes, analyticsRes] = await Promise.all([
                api.get('/api/jobs'),
                api.get('/api/analytics/dashboard')
            ]);
            setJobs(jobsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to terminate this process?")) {
            try {
                await api.delete(`/api/jobs/${id}`);
                fetchData();
            } catch (error) {
                alert("Failed to terminate process");
            }
        }
    }

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/50',
            DELETED: 'bg-gray-900/50 text-gray-500 border border-gray-700',
            FAILED: 'bg-red-950/50 text-red-400 border border-red-500/50',
            COMPLETED: 'bg-blue-950/50 text-blue-400 border border-blue-500/50',
        };
        const style = styles[status] || 'bg-gray-900/50 text-gray-400 border border-gray-700';
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${style}`}>
                {status}
            </span>
        );
    };

    const MetricCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-gray-950/80 backdrop-blur-md rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.05)] border border-emerald-500/20 p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-gray-900 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <p className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-semibold text-emerald-100">{value}</p>
            </div>
        </div>
    );

    const totalSuccess = analytics?.executionsByStatus?.SUCCESS || 0;
    const totalFailed = analytics?.executionsByStatus?.FAILED || 0;
    const totalDead = analytics?.executionsByStatus?.DEAD_LETTER || 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-950 border border-emerald-500/30 p-3 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <p className="text-emerald-400 font-mono text-sm mb-2">{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className="text-sm font-mono" style={{ color: p.color }}>
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-950/80 backdrop-blur-md p-6 rounded-xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <Terminal className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">System Operations</h1>
                            <p className="text-emerald-500/60 text-xs uppercase tracking-widest">Global Dashboard</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/create-job')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                    >
                        Deploy Process
                    </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard 
                        title="Active Nodes" 
                        value={analytics?.activeJobs || 0} 
                        icon={Activity} 
                        color="text-emerald-400" 
                    />
                    <MetricCard 
                        title="Total Nodes" 
                        value={analytics?.totalJobs || 0} 
                        icon={Clock} 
                        color="text-blue-400" 
                    />
                    <MetricCard 
                        title="Success Rate" 
                        value={totalSuccess} 
                        icon={CheckCircle} 
                        color="text-green-400" 
                    />
                    <MetricCard 
                        title="Failed Excs" 
                        value={totalFailed + totalDead} 
                        icon={AlertCircle} 
                        color="text-red-400" 
                    />
                </div>

                {/* Chart Area */}
                <div className="bg-gray-950/80 backdrop-blur-md p-6 rounded-xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    <h3 className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest mb-6">Execution Telemetry (Last 24h)</h3>
                    <div className="h-72 w-full">
                        {analytics?.hourlyMetrics?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.hourlyMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#047857" strokeOpacity={0.2} />
                                    <XAxis dataKey="timestamp" stroke="#059669" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#059669" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="success" name="Success" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" />
                                    <Area type="monotone" dataKey="failed" name="Failed" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-emerald-700 font-mono">
                                Awaiting telemetry data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-gray-950/80 backdrop-blur-md overflow-hidden sm:rounded-xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-emerald-500/20">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Process Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Target Node</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Schedule</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-500/10">
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-emerald-700">
                                            No processes active. Deploy a new process to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-emerald-900/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-100">
                                                <div className="flex items-center">
                                                    {job.name}
                                                    {job.status === 'DELETED' && (
                                                        <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-900 text-gray-500 border border-gray-700 uppercase tracking-wider">
                                                            Read Only
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(job.status)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                                                <span className="font-mono bg-gray-900 px-1.5 py-0.5 rounded mr-2 text-xs border border-emerald-500/30 text-emerald-300">
                                                    {job.httpMethod}
                                                </span>
                                                {job.targetUrl}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-500/70">
                                                {job.scheduleType === 'CRON' ? job.cronExpression : new Date(job.nextExecutionAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold uppercase tracking-widest space-x-4">
                                                <button onClick={() => navigate(`/jobs/${job.id}`)} className="text-blue-400 hover:text-blue-300 transition-colors">
                                                    Inspect
                                                </button>
                                                {job.status !== 'DELETED' && (
                                                    <button onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                                        Terminate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}