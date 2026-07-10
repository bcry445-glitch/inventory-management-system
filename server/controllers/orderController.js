const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, orderedProducts } = req.body;
        let totalAmount = 0;

        // Check stock and calculate total
        for (let item of orderedProducts) {
            const product = await Product.findById(item.productId);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }
            totalAmount += product.sellingPrice * item.quantity;
        }

        // Place order
        const order = await Order.create({ customerName, customerEmail, orderedProducts, totalAmount });

        // Update Inventory (Auto-update after order placement) 
        for (let item of orderedProducts) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('orderedProducts.productId');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};