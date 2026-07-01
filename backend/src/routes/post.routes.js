const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, postController.create);
router.get('/feed', authenticate, postController.getFeed);
router.get('/user/:userId', authenticate, postController.getUserPosts);
router.get('/:postId', authenticate, postController.getPost);
router.delete('/:postId', authenticate, postController.delete);

module.exports = router;