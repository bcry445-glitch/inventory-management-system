const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a product name']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Please specify a supplier']
    },
    purchasePrice: {
        type: Number,
        required: [true, 'Please add a purchase price'],
        min: [0, 'Purchase price cannot be negative']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Please add a selling price']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: [0, 'Quantity cannot be negative'] // Rubric Requirement
    },
    minimumStockLevel: {
        type: Number,
        required: [true, 'Please add a minimum stock level'],
        default: 10
    },
    productImage: {
        type: String,
        default: 'no-image.jpg'
    }
}, { timestamps: true });

// Viva Defense Prep: Custom Validation for Pricing
productSchema.path('sellingPrice').validate(function (value) {
    // Rubric Requirement: Selling Price cannot be lower than Purchase Price
    return value >= this.purchasePrice;
}, 'Selling price cannot be lower than purchase price');

// Viva Defense Prep: Auto-generate the Product Code before saving
productSchema.pre('save', async function (next) {
    // Only generate if it doesn't already exist
    if (!this.productCode) {
        // Find the total number of products to create a sequential number
        const count = await this.constructor.countDocuments();
        // Pad the number with zeros (e.g., 1 becomes 0001)
        const paddedNumber = (count + 1).toString().padStart(4, '0');
        this.productCode = `ASE-PRD-${paddedNumber}`;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);