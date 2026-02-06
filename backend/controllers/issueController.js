const Issue = require('../models/Issue');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * @route   POST /api/issues
 * @desc    Create a new issue
 * @access  Private
 */
const createIssue = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;

        // Validate required fields
        if (!title || !description || !category || !latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let imageUrl = null;

        // Upload image to Cloudinary if file exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'jansamadhan/issues'
            });
            imageUrl = result.secure_url;

            // Delete local file after upload
            fs.unlinkSync(req.file.path);
        }

        // Create issue with GeoJSON location
        const issue = await Issue.create({
            title,
            description,
            category,
            imageUrl,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)] // [lng, lat]
            },
            user: req.user._id
        });

        // Populate user details
        await issue.populate('user', 'name email');

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   GET /api/issues
 * @desc    Get all issues with optional filters
 * @access  Public
 */
const getIssues = async (req, res) => {
    try {
        const { category, status } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;

        const issues = await Issue.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   GET /api/issues/:id
 * @desc    Get single issue by ID
 * @access  Public
 */
const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('user', 'name email')
            .populate('adminComments.addedBy', 'name email');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   GET /api/issues/nearby
 * @desc    Get issues near a location (within radius)
 * @access  Public
 */
const getNearbyIssues = async (req, res) => {
    try {
        const { latitude, longitude, radius = 5000 } = req.query; // radius in meters, default 5km

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Please provide latitude and longitude' });
        }

        // MongoDB geospatial query
        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        }).populate('user', 'name email');

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   PUT /api/issues/:id
 * @desc    Update an issue (only by creator)
 * @access  Private
 */
const updateIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user is the creator
        if (issue.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this issue' });
        }

        const { title, description, category } = req.body;

        issue.title = title || issue.title;
        issue.description = description || issue.description;
        issue.category = category || issue.category;

        const updatedIssue = await issue.save();
        await updatedIssue.populate('user', 'name email');

        res.json(updatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete an issue (only by creator)
 * @access  Private
 */
const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user is the creator
        if (issue.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this issue' });
        }

        await issue.deleteOne();
        res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssueById,
    getNearbyIssues,
    updateIssue,
    deleteIssue
};
