const Issue = require('../models/Issue');

/**
 * @route   GET /api/admin/issues
 * @desc    Get all issues (admin view)
 * @access  Private/Admin
 */
const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate('user', 'name email')
            .populate('adminComments.addedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   PUT /api/admin/issues/:id/status
 * @desc    Update issue status
 * @access  Private/Admin
 */
const updateIssueStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        if (!['REPORTED', 'IN_PROGRESS', 'FIXED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.status = status;
        const updatedIssue = await issue.save();

        await updatedIssue.populate('user', 'name email');
        await updatedIssue.populate('adminComments.addedBy', 'name email');

        res.json(updatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   POST /api/admin/issues/:id/comment
 * @desc    Add admin comment to issue
 * @access  Private/Admin
 */
const addAdminComment = async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ message: 'Please provide a comment' });
        }

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Add comment to adminComments array
        issue.adminComments.push({
            comment,
            addedBy: req.user._id,
            addedAt: new Date()
        });

        const updatedIssue = await issue.save();

        await updatedIssue.populate('user', 'name email');
        await updatedIssue.populate('adminComments.addedBy', 'name email');

        res.json(updatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
const getStats = async (req, res) => {
    try {
        // Count issues by status
        const totalIssues = await Issue.countDocuments();
        const reportedIssues = await Issue.countDocuments({ status: 'REPORTED' });
        const inProgressIssues = await Issue.countDocuments({ status: 'IN_PROGRESS' });
        const fixedIssues = await Issue.countDocuments({ status: 'FIXED' });

        // Count issues by category
        const categoryStats = await Issue.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalIssues,
            reportedIssues,
            inProgressIssues,
            fixedIssues,
            categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllIssues,
    updateIssueStatus,
    addAdminComment,
    getStats
};
