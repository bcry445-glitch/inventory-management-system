const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
    try {
        console.log("Product creation request received:", req.body);
        const product = await Product.create(req.body);
        
        return res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        // This log will appear in your VS Code terminal
        console.error("--- PRODUCT CREATION ERROR START ---");
        console.error(error); 
        console.error("--- PRODUCT CREATION ERROR END ---");
        
        // This stops the app from crashing and sends the error to your UI
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};