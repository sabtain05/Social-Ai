const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, commentController.create);
router.get('/', authenticate, commentController.getComments);
router.delete('/:commentId', authenticate, commentController.delete);

module.exports = router;