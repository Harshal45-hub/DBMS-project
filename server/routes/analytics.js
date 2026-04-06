const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/frequency', analyticsController.getWearFrequency);
router.get('/trends', analyticsController.getStyleTrends);
router.get('/sustainability', analyticsController.getSustainabilityMetrics);

module.exports = router;