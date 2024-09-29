require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const RateVariance = require("./models/rate")
const Currency = require('./models/currency'); // Import the currency model
const cors = require('cors'); // Import the cors package
const app = express();
app.use(cors()); // This will enable CORS for all routes
app.use(express.json()); // This is important for parsing JSON data

const port = process.env.PORT
const mongoURI = process.env.MONGO_URI

const hardcodedUser = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD // Change this to your preferred password
};

// MongoDB connection


;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Axios request configuration
let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://www.dolarbluebolivia.click/api/dolar_blue',
    headers: { 
        'accept': '*/*', 
        'accept-language': 'en-US,en;q=0.9', 
        'dnt': '1', 
        'referer': 'https://www.dolarbluebolivia.click/', 
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"macOS"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'same-origin', 
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
    }
};

// Function to make the API request and save data to MongoDB
const fetchAndSaveCurrencyData = async () => {
    try {
        const response = await axios.request(config);
        const data = response.data;

        // Create a new instance of the Currency model each time
        const newCurrency = new Currency({
            blue: {
                buy: data.blue.buy,
                sell: data.blue.sell
            },
            official: {
                buy: data.official.buy,
                sell: data.official.sell
            },
            // Force a unique timestamp or ID for each entry (optional)
            _id: new mongoose.Types.ObjectId()
        });

        // Save the new instance to MongoDB (this will create a new entry)
        await newCurrency.save();
        // console.log('New currency data saved to DB:', newCurrency);
    } catch (error) {
        console.error('Error fetching or saving currency data:', error);
    }
};

// Call the function initially
fetchAndSaveCurrencyData();

// Set up interval to run every 5 minutes (300,000 ms)
setInterval(fetchAndSaveCurrencyData, 300000); // 5 minutes

app.get('/api/chart-data', async (req, res) => {
    const { timeframe } = req.query; // Expecting a query parameter for timeframe

    let dateFilter;
    const now = new Date();

    // Determine the date filter based on the timeframe
    switch (timeframe) {
        case 'daily':
            dateFilter = new Date(now.setDate(now.getDate() - 1)); // Last 24 hours
            break;
        case 'weekly':
            dateFilter = new Date(now.setDate(now.getDate() - 7)); // Last 7 days
            break;
        case 'monthly':
            dateFilter = new Date(now.setMonth(now.getMonth() - 1)); // Last 30 days
            break;
        default:
            return res.status(400).send({ message: 'Invalid timeframe' });
    }

    try {
        const data = await Currency.find({ createdAt: { $gte: dateFilter } }).sort({ createdAt: 1 }); // Sort by date ascending
        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).send({ message: 'Error fetching data' });
    }
});

app.get('/api/latest', async (req, res) => {
    try {
        // Find the most recent document
        const latestCurrency = await Currency.findOne().sort({ createdAt: -1 });
        
        // If no data is found, return a 404
        if (!latestCurrency) {
            return res.status(404).json({ message: 'No currency data found' });
        }
        
        // Send the latest currency data
        res.status(200).json(latestCurrency);
    } catch (error) {
        console.error('Error fetching latest currency data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        return res.status(200).json({ message: 'Login successful' });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

// Endpoint to save rate variance
app.post('/api/rate-variance', async (req, res) => {
    const { rateVariance } = req.body; // Destructure the rateVariance from the request body

    try {
        // Create a new instance of the RateVariance model
        const newRateVariance = new RateVariance({ rateVariance });
        await newRateVariance.save(); // Save to MongoDB

        return res.status(201).json({ message: 'Rate variance saved successfully', data: newRateVariance });
    } catch (error) {
        console.error('Error saving rate variance:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
