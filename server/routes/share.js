const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.post('/', shareController.createShareLink);
router.get('/:token', shareController.getSharedWardrobe);
router.post('/suggest', shareController.submitSuggestion);

module.exports = router;