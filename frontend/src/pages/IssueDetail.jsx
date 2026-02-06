import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueAPI } from '../services/api';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '300px'
};

/**
 * Issue Detail Page
 * Display full details of a single issue
 */
const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const fetchIssue = async () => {
        try {
            const response = await issueAPI.getById(id);
            setIssue(response.data);
        } catch (err) {
            setError('Failed to load issue details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error || 'Issue not found'}
                    </div>
                    <button
                        onClick={() => navigate('/issues')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Issues
                    </button>
                </div>
            </div>
        );
    }

    const center = {
        lat: issue.location.coordinates[1],
        lng: issue.location.coordinates[0]
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate('/issues')}
                    className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back to Issues
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Image */}
                    {issue.imageUrl && (
                        <div className="w-full h-96 overflow-hidden">
                            <img
                                src={issue.imageUrl}
                                alt={issue.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {issue.title}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[issue.status]}`}>
                                        {STATUS_LABELS[issue.status]}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Category: <span className="font-medium">{issue.category}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
                        </div>

                        {/* Reporter Info */}
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Reported By</h2>
                            <p className="text-gray-700">
                                <span className="font-medium">{issue.user?.name || 'Anonymous'}</span>
                                <span className="text-gray-500 ml-2">
                                    on {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </p>
                        </div>

                        {/* Location Map */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
                            <div className="rounded-lg overflow-hidden border border-gray-300">
                                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={center}
                                        zoom={15}
                                    >
                                        <Marker position={center} />
                                    </GoogleMap>
                                </LoadScript>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Coordinates: {issue.location.coordinates[1].toFixed(6)}, {issue.location.coordinates[0].toFixed(6)}
                            </p>
                        </div>

                        {/* Admin Comments */}
                        {issue.adminComments && issue.adminComments.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Admin Updates</h2>
                                <div className="space-y-3">
                                    {issue.adminComments.map((comment, index) => (
                                        <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                            <p className="text-gray-800">{comment.comment}</p>
                                            <p className="text-sm text-gray-600 mt-2">
                                                By {comment.addedBy?.name || 'Admin'} on{' '}
                                                {new Date(comment.addedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
