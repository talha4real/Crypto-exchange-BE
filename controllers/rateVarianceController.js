const RateVariance = require('../models/rate');

// Endpoint to save rate variance
const saveRateVariance = async (req, res) => {
    const { rateVariance } = req.body;

    try {
        const newRateVariance = new RateVariance({ rateVariance });
        await newRateVariance.save();
        return res.status(201).json({ message: 'Rate variance saved successfully', data: newRateVariance });
    } catch (error) {
        console.error('Error saving rate variance:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    saveRateVariance
};
