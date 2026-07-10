const express = require('express');
const router = express.Router();

// Import the perfectly clean controller we just made
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// Import the security middleware
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes
router.post('/', protect, createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;