const mongoose = require('mongoose');

/**
 * Issue Schema
 * Stores community issues with location, status, and admin comments
 */
const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Road', 'Garbage', 'Water', 'Electricity', 'Other']
    },
    status: {
        type: String,
        enum: ['REPORTED', 'IN_PROGRESS', 'FIXED'],
        default: 'REPORTED'
    },
    imageUrl: {
        type: String,
        default: null
    },
    // GeoJSON format for MongoDB geospatial queries
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    // Reference to user who reported the issue
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Admin comments on the issue
    adminComments: [{
        comment: {
            type: String,
            required: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Create geospatial index for location-based queries
issueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);
