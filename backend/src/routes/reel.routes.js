const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reel.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { reelUpload } = require('../middleware/upload.middleware');

// All routes require authentication
router.use(authenticate);

// Create reel
router.post('/', reelUpload.single('video'), reelController.create);

// Feed route - must be before /:reelId routes
router.get('/feed', reelController.getFeed);

// Get user's reels - separate route without optional parameter
router.get('/user/:userId', reelController.getUserReels);

// Single reel routes
router.get('/:reelId', reelController.getReel);
router.post('/:reelId/like', reelController.toggleLike);

// Comment routes
router.post('/:reelId/comments', reelController.addComment);
router.get('/:reelId/comments', reelController.getComments);
router.delete('/:reelId/comments/:commentId', reelController.deleteComment);

// Delete reel
router.delete('/:reelId', reelController.delete);

module.exports = router;