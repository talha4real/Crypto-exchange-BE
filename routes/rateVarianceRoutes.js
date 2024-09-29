const express = require('express');
const { saveRateVariance } = require('../controllers/rateVarianceController');

const router = express.Router();

router.post('/', saveRateVariance);

module.exports = router;
