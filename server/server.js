const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Route Files
const auth = require('./routes/authRoutes');
const orders = require('./routes/orderRoutes'); // Add this line

app.use('/api/auth', auth);
app.use('/api/orders', orders); // Add this line

// Basic API Health Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running perfectly' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});