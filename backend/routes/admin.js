const express = require('express');
const {
    getAllIssues,
    updateIssueStatus,
    addAdminComment,
    getStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// @route   GET /api/admin/stats
router.get('/stats', getStats);

// @route   GET /api/admin/issues
router.get('/issues', getAllIssues);

// @route   PUT /api/admin/issues/:id/status
router.put('/issues/:id/status', updateIssueStatus);

// @route   POST /api/admin/issues/:id/comment
router.post('/issues/:id/comment', addAdminComment);

module.exports = router;
