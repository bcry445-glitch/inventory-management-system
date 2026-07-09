const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please provide the customer name']
    },
    customerEmail: {
        type: String,
        required: [true, 'Please provide the customer email']
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderedProducts: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1']
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0 // This will be auto-calculated by our controller logic
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);