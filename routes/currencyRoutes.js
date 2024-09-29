const express = require('express');
const {
    getChartData,
    getLatestCurrency
} = require('../controllers/currencyController');

const router = express.Router();

router.get('/chart-data', getChartData);
router.get('/latest', getLatestCurrency);

module.exports = router;
