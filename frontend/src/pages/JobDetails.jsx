import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Terminal } from 'lucide-react';
import api from '../api/axiosConfig';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobRes, execRes] = await Promise.all([
                    api.get(`/api/jobs/${id}`),
                    api.get(`/api/jobs/${id}/executions`)
                ]);
                setJob(jobRes.data);
                setExecutions(execRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const getStatusBadge = (status) => {
        const styles = {
            SUCCESS: 'bg-green-950/50 text-green-400 border border-green-500/50',
            FAILED: 'bg-red-950/50 text-red-400 border border-red-500/50',
            DEAD_LETTER: 'bg-red-950/80 text-red-500 border border-red-600',
            RUNNING: 'bg-yellow-950/50 text-yellow-400 border border-yellow-500/50',
            RETRYING: 'bg-orange-950/50 text-orange-400 border border-orange-500/50',
            QUEUED: 'bg-blue-950/50 text-blue-400 border border-blue-500/50'
        };
        const style = styles[status] || 'bg-gray-900/50 text-gray-400 border border-gray-700';
        return (
            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-950/80 backdrop-blur-md p-6 rounded-xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="flex flex-col">
                    <button onClick={() => navigate(-1)} className="text-emerald-500 hover:text-emerald-300 flex items-center text-sm font-bold uppercase tracking-widest mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Return
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <Terminal className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">
                                {job ? job.name : 'Process Node'}
                            </h1>
                            <p className="text-emerald-500/60 text-xs uppercase tracking-widest">Execution Log</p>
                        </div>
                    </div>
                </div>
            </div>

            {job?.status === 'DELETED' && (
                <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">
                                Warning: Process Terminated (Read Only)
                            </h3>
                            <div className="mt-1 text-sm text-amber-500/80 font-sans">
                                This process has been stopped and marked for deletion. No new executions will be scheduled. 
                                The system garbage collector will permanently purge this node during the next cycle.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-950/80 backdrop-blur-md overflow-hidden sm:rounded-xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                {loading ? (
                    <div className="p-12 text-center text-emerald-700 font-bold uppercase tracking-widest animate-pulse">
                        Scanning history...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-emerald-500/20">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">PID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Scheduled</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Completed</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Assigned Worker</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-500/10">
                                {executions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-emerald-700 font-bold uppercase tracking-widest">
                                            No execution telemetry found.
                                        </td>
                                    </tr>
                                ) : (
                                    executions.map((exec) => (
                                        <tr key={exec.id} className="hover:bg-emerald-900/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-400">#{exec.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(exec.status)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-100 font-sans">
                                                {new Date(exec.scheduledFor).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-100 font-sans">
                                                {exec.completedAt ? new Date(exec.completedAt).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-500/70 font-mono">
                                                {exec.workerId || 'Pending Assignment'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
