import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig.js"
import { Terminal } from "lucide-react";

export default function CreateJob() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        targetUrl: '',
        httpMethod: 'POST',
        scheduleType: 'CRON',
        cronExpression: '0 0 * * *',
        maxRetries: 3,
        payload: '{}',
        headers: {"Content-Type": "application/json"},
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payloadToSend = {
                ...formData,
                headers: JSON.stringify(formData.headers)
            };
            await api.post("/api/jobs", payloadToSend);
            navigate("/dashboard");
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === 'string') {
                setError(data);
            } else if (data && data.message) {
                setError(data.message);
            } else if (data && data.error) {
                setError(data.error);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">Deploy Process</h1>
                    <p className="text-emerald-500/60 text-xs uppercase tracking-widest">Initialize Node Configuration</p>
                </div>
            </div>

            <div className="bg-gray-950/80 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.05)] sm:rounded-xl border border-emerald-500/30">
                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    {error && (
                        <div className="bg-red-950/50 text-red-400 p-4 rounded border border-red-500/50 text-sm font-bold uppercase tracking-wide">
                            [ERROR]: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Process Name</label>
                            <input type="text" required
                                className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-emerald-700/30"
                                placeholder="e.g. daily-data-sync"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Target Node (URL)</label>
                            <input type="url" required
                                className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-emerald-700/30"
                                placeholder="https://api.system.net/sync"
                                value={formData.targetUrl} onChange={e => setFormData({...formData, targetUrl: e.target.value})} />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Protocol</label>
                            <select 
                                className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                value={formData.httpMethod} onChange={e => setFormData({...formData, httpMethod: e.target.value})}>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Execution Schedule</label>
                            <select 
                                className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                value={formData.scheduleType} onChange={e => setFormData({...formData, scheduleType: e.target.value})}>
                                <option value="CRON">Cron Expression</option>
                                <option value="ONE_TIME">One Time</option>
                            </select>
                        </div>

                        {formData.scheduleType === 'CRON' && (
                            <div className="sm:col-span-3">
                                <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Cron Signature</label>
                                <input type="text" required
                                    className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-emerald-700/30"
                                    value={formData.cronExpression} onChange={e => setFormData({...formData, cronExpression: e.target.value})} />
                            </div>
                        )}

                        <div className="sm:col-span-6">
                            <label className="block text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-1">Payload (JSON)</label>
                            <textarea rows="4"
                                className="block w-full bg-gray-900 border border-emerald-500/30 rounded-lg p-3 text-emerald-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                value={formData.payload} onChange={e => setFormData({...formData, payload: e.target.value})} />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end space-x-4 border-t border-emerald-500/20 mt-6">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded text-emerald-500 font-bold uppercase tracking-widest border border-emerald-700 hover:bg-emerald-950/50 hover:border-emerald-400 hover:text-emerald-300 transition-all">
                            Abort
                        </button>
                        <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-6 py-2.5 rounded font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] disabled:opacity-50">
                            {loading ? 'Compiling...' : 'Execute Deploy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}