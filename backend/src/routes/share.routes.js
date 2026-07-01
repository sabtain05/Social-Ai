const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:postId/track', authenticate, shareController.trackShare);

module.exports = router;