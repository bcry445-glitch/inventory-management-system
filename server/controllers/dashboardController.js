const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');

// @desc    Get all dashboard statistics
// @route   GET /api/dashboard
// @access  Protected
exports.getDashboardStats = async (req, res) => {
    try {
        // Viva Prep: We use Promise.all to run all database queries at the EXACT SAME TIME.
        // This makes the API incredibly fast compared to awaiting them one by one.
        const [
            totalProducts,
            outOfStockProducts,
            totalSuppliers,
            totalOrders,
            allProducts // Needed for the math calculations below
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ quantity: 0 }),
            Supplier.countDocuments(),
            Order.countDocuments(),
            Product.find() 
        ]);

        // Calculate dynamic low stock (where quantity is less than the minimum threshold)
        const lowStockProducts = allProducts.filter(p => p.quantity > 0 && p.quantity <= p.minimumStockLevel).length;

        // Calculate total inventory value (Purchase Price * Quantity on hand)
        const inventoryValue = allProducts.reduce((acc, item) => acc + (item.purchasePrice * item.quantity), 0);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                lowStockProducts,
                outOfStockProducts,
                totalSuppliers,
                totalOrders,
                inventoryValue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};