import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig.js"

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
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Create New Job</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Job Name</label>
                            <div className="mt-1">
                                <input type="text" required
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Target URL</label>
                            <div className="mt-1">
                                <input type="url" required
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    value={formData.targetUrl} onChange={e => setFormData({...formData, targetUrl: e.target.value})} />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">HTTP Method</label>
                            <div className="mt-1">
                                <select 
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white"
                                    value={formData.httpMethod} onChange={e => setFormData({...formData, httpMethod: e.target.value})}>
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
                            <div className="mt-1">
                                <select 
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white"
                                    value={formData.scheduleType} onChange={e => setFormData({...formData, scheduleType: e.target.value})}>
                                    <option value="CRON">Cron Expression</option>
                                    <option value="ONE_TIME">One Time</option>
                                </select>
                            </div>
                        </div>

                        {formData.scheduleType === 'CRON' && (
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Cron Expression</label>
                                <div className="mt-1">
                                    <input type="text" required
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border font-mono"
                                        value={formData.cronExpression} onChange={e => setFormData({...formData, cronExpression: e.target.value})} />
                                </div>
                            </div>
                        )}

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">JSON Payload</label>
                            <div className="mt-1">
                                <textarea rows="4"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border font-mono"
                                    value={formData.payload} onChange={e => setFormData({...formData, payload: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={() => navigate('/dashboard')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                            {loading ? 'Scheduling...' : 'Schedule Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}