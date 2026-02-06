import { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';
import { CATEGORIES, STATUS } from '../utils/constants';

/**
 * Issues List Page
 * Display all issues with filtering and map view
 */
const IssuesList = () => {
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMap, setShowMap] = useState(false);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [issues, categoryFilter, statusFilter, searchQuery]);

    const fetchIssues = async () => {
        try {
            const response = await issueAPI.getAll();
            setIssues(response.data);
            setFilteredIssues(response.data);
        } catch (err) {
            setError('Failed to load issues');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...issues];

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(issue => issue.category === categoryFilter);
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(issue => issue.status === statusFilter);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredIssues(filtered);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading issues...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Issues</h1>

                    {/* View Toggle */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setShowMap(false)}
                            className={`px-4 py-2 rounded-md font-medium transition ${!showMap
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => setShowMap(true)}
                            className={`px-4 py-2 rounded-md font-medium transition ${showMap
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                        >
                            Map View
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />

                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value={STATUS.REPORTED}>Reported</option>
                                <option value={STATUS.IN_PROGRESS}>In Progress</option>
                                <option value={STATUS.FIXED}>Fixed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Content */}
                {showMap ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <MapView issues={filteredIssues} />
                    </div>
                ) : (
                    <>
                        {filteredIssues.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No issues found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredIssues.map((issue) => (
                                    <IssueCard key={issue._id} issue={issue} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default IssuesList;
