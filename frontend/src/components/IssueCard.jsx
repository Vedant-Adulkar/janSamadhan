import { Link } from 'react-router-dom';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

/**
 * Issue Card Component
 * Displays issue information in a card format
 */
const IssueCard = ({ issue }) => {
    return (
        <Link to={`/issues/${issue._id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
                {/* Issue image */}
                {issue.imageUrl && (
                    <div className="h-48 overflow-hidden">
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                <div className="p-4">
                    {/* Status badge */}
                    <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[issue.status]}`}>
                            {STATUS_LABELS[issue.status]}
                        </span>
                        <span className="text-xs text-gray-500">
                            {issue.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {issue.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {issue.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {issue.user?.name || 'Anonymous'}</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default IssueCard;
