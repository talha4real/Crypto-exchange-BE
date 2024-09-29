const mongoose = require('mongoose');


const RateVarianceSchema = new mongoose.Schema({
    rateVariance: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Create the model
const RateVariance = mongoose.model('RateVariance', RateVarianceSchema);

module.exports = RateVariance;
