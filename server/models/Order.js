const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    orderedProducts: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    }
});

module.exports = mongoose.model('Order', orderSchema);