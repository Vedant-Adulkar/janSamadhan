import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueAPI } from '../services/api';
import { CATEGORIES } from '../utils/constants';

/**
 * Create Issue Page
 * Form to report a new community issue
 */
const CreateIssue = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        latitude: '',
        longitude: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    const navigate = useNavigate();

    // Auto-detect user location on mount
    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            setLocationLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLocationLoading(false);
                }
            );
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        if (!formData.title || !formData.description || !formData.category) {
            setError('Please fill in all required fields');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setError('Please allow location access or enter coordinates manually');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);

            if (image) {
                data.append('image', image);
            }

            await issueAPI.create(data);
            navigate('/issues');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Report an Issue</h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Brief description of the issue"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Detailed description of the issue"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Image (Optional)
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="latitude"
                                    name="latitude"
                                    required
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Auto-detected"
                                />
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    id="longitude"
                                    name="longitude"
                                    required
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Auto-detected"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={getLocation}
                            disabled={locationLoading}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {locationLoading ? 'Detecting location...' : '📍 Detect my location'}
                        </button>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Issue'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/issues')}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateIssue;
