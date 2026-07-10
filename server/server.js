const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON
app.use(cors());         // Allows your React app to talk to the backend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err.message);
    });

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Added Order Routes
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Add this right above your routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Mounted Order Routes

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in development mode on port ${PORT}`));