const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/search', authenticate, institutionController.search);

module.exports = router;