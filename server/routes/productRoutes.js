const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Only Admins and Managers can create products. Anyone logged in can view them.
router.route('/')
    .get(protect, getProducts)
    .post(protect, authorize('Admin', 'Manager'), createProduct);

module.exports = router;