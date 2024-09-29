const jwt = require('jsonwebtoken');

// Hardcoded user (retrieved from environment variables)
const hardcodedUser = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
};

// Secret key for signing JWT (should be kept secure)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Make sure to store this securely in environment variables

// Login endpoint
const login = (req, res) => {
    const { username, password } = req.body;

    // Validate the username and password
    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        // Generate a JWT token with a payload
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        return res.status(200).json({
            message: 'Login successful',
            token
        });
    }

    // Return unauthorized response if credentials are invalid
    return res.status(401).json({ message: 'Invalid credentials' });
};

module.exports = {
    login
};
