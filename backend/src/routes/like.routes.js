const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:postId/toggle', authenticate, likeController.toggleLike);

module.exports = router;