const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const commentRoutes = require('./comment.routes');
const likeRoutes = require('./like.routes');
const followRoutes = require('./follow.routes');
const friendRequestRoutes = require('./friendRequest.routes');
const shareRoutes = require('./share.routes');
const aiRoutes = require('./ai.routes');
const notificationRoutes = require('./notification.routes');
const institutionRoutes = require('./institution.routes');
const reelRoutes = require('./reel.routes');

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Social Ai API is running' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/posts/:postId/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/follow', followRoutes);
router.use('/friend-requests', friendRequestRoutes);
router.use('/shares', shareRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/institutions', institutionRoutes);
router.use('/reels', reelRoutes);

module.exports = router;