const express = require('express');
const router = express.Router();
const friendRequestController = require('../controllers/friendRequest.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/send/:receiverId', authenticate, friendRequestController.sendRequest);
router.post('/:requestId/accept', authenticate, friendRequestController.acceptRequest);
router.post('/:requestId/reject', authenticate, friendRequestController.rejectRequest);
router.get('/pending', authenticate, friendRequestController.getPendingRequests);

module.exports = router;