require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const currencyRoutes = require('./routes/currencyRoutes');
const rateVarianceRoutes = require('./routes/rateVarianceRoutes');
const authRoutes = require('./routes/authRoutes');
const Currency = require('./models/currency');
const cors = require('cors'); 
const app = express();
app.use(cors()); 
app.use(express.json()); 

const port = process.env.PORT
const mongoURI = process.env.MONGO_URL


// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true })
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


// Set up routes
app.use('/api/currencies', currencyRoutes);
app.use('/api/rate-variance', rateVarianceRoutes);
app.use('/api/auth', authRoutes);



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
