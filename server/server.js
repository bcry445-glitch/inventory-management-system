require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

// IMPORT THE SWAGGER CONFIGURATION (Fixed .js extension)
const swaggerDocs = require('./swagger.js'); 

// ==========================================
// IMPORT ROUTES 
// 🚨 VERIFY THESE FILENAMES MATCH YOUR FOLDER EXACTLY
// ==========================================
const authRoutes = require('./routes/auth');       // Example: Change 'auth' to 'authRoute' if needed
const productRoutes = require('./routes/products'); // Example: Change 'products' to 'productRoute' if needed
const orderRoutes = require('./routes/orders');     // Example: Change 'orders' to 'orderRoutes' if needed

const app = express();

// MIDDLEWARE
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors()); // Allows your frontend to communicate with Render

// SWAGGER API DOCUMENTATION ROUTE
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// APPLICATION ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ROOT HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Allied Enterprise Inventory API is running securely.');
});

// GLOBAL ERROR HANDLER (Catches any unexpected crashes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// MONGODB CONNECTION & SERVER INITIALIZATION
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exits the process if the database connection fails
  });