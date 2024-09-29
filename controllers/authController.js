const hardcodedUser = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
};

// Login endpoint
const login = (req, res) => {
    const { username, password } = req.body;

    if (username === hardcodedUser.username && password === hardcodedUser.password) {
        return res.status(200).json({ message: 'Login successful' });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
};

module.exports = {
    login
};
