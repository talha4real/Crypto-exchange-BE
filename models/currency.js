const mongoose = require('mongoose');

// Define the schema
const currencySchema = new mongoose.Schema({
  blue: {
    buy: {
      type: Number,
      required: true,
    },
    sell: {
      type: Number,
      required: true,
    },
  },
  official: {
    buy: {
      type: Number,
      required: true,
    },
    sell: {
      type: Number,
      required: true,
    },
  },
}, { timestamps: true }); // Enable timestamps

// Create the model
const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
