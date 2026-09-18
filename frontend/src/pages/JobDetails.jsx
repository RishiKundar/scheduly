import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExecutions = async () => {
            try {
                const response = await api.get(`/api/jobs/${id}/executions`);
                setExecutions(response.data);
            } catch (error) {
                console.error("Error fetching executions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExecutions();
    }, [id]);

    const getStatusBadge = (status) => {
        const styles = {
            SUCCESS: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            DEAD_LETTER: 'bg-red-200 text-red-900',
            RUNNING: 'bg-yellow-100 text-yellow-800',
            RETRYING: 'bg-orange-100 text-orange-800',
            QUEUED: 'bg-blue-100 text-blue-800'
        };
        const style = styles[status] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
                        &larr; Back
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">Execution History</h1>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading history...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Execution ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled For</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {executions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No executions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                executions.map((exec) => (
                                    <tr key={exec.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{exec.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(exec.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(exec.scheduledFor).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {exec.completedAt ? new Date(exec.completedAt).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {exec.workerId || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
