import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_CENTER, STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

const mapContainerStyle = {
    width: '100%',
    height: '500px'
};

/**
 * Map View Component
 * Displays issues on Google Maps with markers
 */
const MapView = ({ issues, center = DEFAULT_CENTER }) => {
    const [selectedIssue, setSelectedIssue] = useState(null);

    // Get marker color based on status
    const getMarkerColor = (status) => {
        switch (status) {
            case 'REPORTED':
                return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            case 'IN_PROGRESS':
                return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            case 'FIXED':
                return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            default:
                return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
            >
                {/* Render markers for each issue */}
                {issues.map((issue) => (
                    <Marker
                        key={issue._id}
                        position={{
                            lat: issue.location.coordinates[1],
                            lng: issue.location.coordinates[0]
                        }}
                        icon={getMarkerColor(issue.status)}
                        onClick={() => setSelectedIssue(issue)}
                    />
                ))}

                {/* Info window for selected issue */}
                {selectedIssue && (
                    <InfoWindow
                        position={{
                            lat: selectedIssue.location.coordinates[1],
                            lng: selectedIssue.location.coordinates[0]
                        }}
                        onCloseClick={() => setSelectedIssue(null)}
                    >
                        <div className="p-2 max-w-xs">
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {selectedIssue.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {selectedIssue.description.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedIssue.status]}`}>
                                    {STATUS_LABELS[selectedIssue.status]}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {selectedIssue.category}
                                </span>
                            </div>
                            <Link
                                to={`/issues/${selectedIssue._id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapView;
