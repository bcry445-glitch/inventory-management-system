const express = require('express');
const { createOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Route: POST /api/orders
// Security: Must be logged in (protect). 
router.post('/', protect, createOrder);

module.exports = router;