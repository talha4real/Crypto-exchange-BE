const Currency = require('../models/currency');

// Fetch and save currency data
const fetchAndSaveCurrencyData = async (axiosConfig) => {
    try {
        const response = await axios.request(axiosConfig);
        const data = response.data;

        const newCurrency = new Currency({
            blue: {
                buy: data.blue.buy,
                sell: data.blue.sell
            },
            official: {
                buy: data.official.buy,
                sell: data.official.sell
            },
            _id: new mongoose.Types.ObjectId()
        });

        await newCurrency.save();
    } catch (error) {
        console.error('Error fetching or saving currency data:', error);
    }
};

// Get chart data based on timeframe
const getChartData = async (req, res) => {
    const { timeframe } = req.query;
    let dateFilter;
    const now = new Date();

    switch (timeframe) {
        case 'daily':
            dateFilter = new Date(now.setDate(now.getDate() - 1));
            break;
        case 'weekly':
            dateFilter = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'monthly':
            dateFilter = new Date(now.setMonth(now.getMonth() - 1));
            break;
        default:
            return res.status(400).send({ message: 'Invalid timeframe' });
    }

    try {
        const data = await Currency.find({ createdAt: { $gte: dateFilter } }).sort({ createdAt: 1 });
        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).send({ message: 'Error fetching data' });
    }
};

// Get the latest currency entry
const getLatestCurrency = async (req, res) => {
    try {
        const latestCurrency = await Currency.findOne().sort({ createdAt: -1 });
        if (!latestCurrency) {
            return res.status(404).json({ message: 'No currency data found' });
        }
        res.status(200).json(latestCurrency);
    } catch (error) {
        console.error('Error fetching latest currency data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    fetchAndSaveCurrencyData,
    getChartData,
    getLatestCurrency
};
