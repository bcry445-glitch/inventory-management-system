require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

// IMPORT THE NEW SWAGGER CONFIGURATION (Fixed .js extension)
const swaggerDocs = require('./swagger.js'); 

// IMPORT ROUTES 
// (Ensure these file paths match your exact file names in the /routes folder)
const authRoutes = require('./routes/auth'); // or authRoutes.js depending on your naming
const productRoutes = require('./routes/products'); 
const orderRoutes = require('./routes/orders');

const app = express();

// MIDDLEWARE
app.use(express.json()); // Parses incoming JSON payloads
app.use(cors()); // Allows your Vercel frontend to communicate with Render

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