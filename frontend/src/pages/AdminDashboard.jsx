import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { STATUS, STATUS_LABELS, STATUS_COLORS } from '../utils/constants';

/**
 * Admin Dashboard Page
 * Manage all issues, update status, and add comments
 */
const AdminDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuesRes, statsRes] = await Promise.all([
                adminAPI.getAllIssues(),
                adminAPI.getStats()
            ]);
            setIssues(issuesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            setError('Failed to load admin data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        try {
            await adminAPI.updateStatus(issueId, newStatus);
            // Update local state
            setIssues(issues.map(issue =>
                issue._id === issueId ? { ...issue, status: newStatus } : issue
            ));
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const handleAddComment = async (issueId) => {
        const comment = commentText[issueId];
        if (!comment || !comment.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            const response = await adminAPI.addComment(issueId, comment);
            // Update local state
            setIssues(issues.map(issue =>
                issue._id === issueId ? response.data : issue
            ));
            // Clear comment input
            setCommentText({ ...commentText, [issueId]: '' });
        } catch (err) {
            alert('Failed to add comment');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Issues</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalIssues}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg shadow-md p-6">
                            <h3 className="text-red-600 text-sm font-medium mb-2">Reported</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.reportedIssues}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg shadow-md p-6">
                            <h3 className="text-amber-600 text-sm font-medium mb-2">In Progress</h3>
                            <p className="text-3xl font-bold text-amber-600">{stats.inProgressIssues}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg shadow-md p-6">
                            <h3 className="text-green-600 text-sm font-medium mb-2">Fixed</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.fixedIssues}</p>
                        </div>
                    </div>
                )}

                {/* Issues Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">All Issues</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reported By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {issues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {issue.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{issue.category}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={issue.status}
                                                onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[issue.status]} cursor-pointer`}
                                            >
                                                <option value={STATUS.REPORTED}>{STATUS_LABELS[STATUS.REPORTED]}</option>
                                                <option value={STATUS.IN_PROGRESS}>{STATUS_LABELS[STATUS.IN_PROGRESS]}</option>
                                                <option value={STATUS.FIXED}>{STATUS_LABELS[STATUS.FIXED]}</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {issue.user?.name || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add comment..."
                                                    value={commentText[issue._id] || ''}
                                                    onChange={(e) => setCommentText({
                                                        ...commentText,
                                                        [issue._id]: e.target.value
                                                    })}
                                                    className="text-sm px-2 py-1 border border-gray-300 rounded"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(issue._id)}
                                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            {issue.adminComments && issue.adminComments.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {issue.adminComments.length} comment(s)
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {issues.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No issues found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
