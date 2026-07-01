const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

router.get('/search', authenticate, userController.searchUsers);
router.get('/:username', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/profile-picture', authenticate, upload.single('profile_picture'), userController.updateProfilePicture);
router.get('/:userId/followers', authenticate, userController.getFollowers);
router.get('/:userId/following', authenticate, userController.getFollowing);
router.get('/:userId/friends', authenticate, userController.getFriends);

module.exports = router;