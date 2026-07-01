const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:userId/follow', authenticate, followController.follow);
router.delete('/:userId/unfollow', authenticate, followController.unfollow);

module.exports = router;