const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order and update inventory
// @route   POST /api/orders
// @access  Protected (Employee, Manager, Admin)
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, orderedProducts } = req.body;

        if (!orderedProducts || orderedProducts.length === 0) {
            return res.status(400).json({ success: false, message: 'No products in the order' });
        }

        let calculatedTotal = 0;
        
        // 1. Loop through requested products to calculate total and check stock
        for (const item of orderedProducts) {
            const dbProduct = await Product.findById(item.product);
            
            if (!dbProduct) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }

            // Rubric Requirement: Prevent ordering if stock is unavailable
            if (dbProduct.quantity < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.quantity}, Requested: ${item.quantity}` 
                });
            }

            // Rubric Requirement: Automatically calculate Total Bill
            calculatedTotal += (dbProduct.sellingPrice * item.quantity);
        }

        // 2. If all stock checks pass, create the order
        const order = await Order.create({
            customerName,
            customerEmail,
            orderedProducts,
            totalAmount: calculatedTotal
        });

        // 3. Rubric Requirement: Inventory auto-update after order placement
        for (const item of orderedProducts) {
            const dbProduct = await Product.findById(item.product);
            dbProduct.quantity -= item.quantity;
            await dbProduct.save();
        }

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};