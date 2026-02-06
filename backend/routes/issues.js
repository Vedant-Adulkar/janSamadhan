const express = require('express');
const multer = require('multer');
const {
    createIssue,
    getIssues,
    getIssueById,
    getNearbyIssues,
    updateIssue,
    deleteIssue
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Temporary storage before Cloudinary upload
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// @route   GET /api/issues/nearby
// Must be before /:id route to avoid conflict
router.get('/nearby', getNearbyIssues);

// @route   POST /api/issues
router.post('/', protect, upload.single('image'), createIssue);

// @route   GET /api/issues
router.get('/', getIssues);

// @route   GET /api/issues/:id
router.get('/:id', getIssueById);

// @route   PUT /api/issues/:id
router.put('/:id', protect, updateIssue);

// @route   DELETE /api/issues/:id
router.delete('/:id', protect, deleteIssue);

module.exports = router;
