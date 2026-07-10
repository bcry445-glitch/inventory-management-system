const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: { 
        type: String, 
        unique: true 
    },
    name: { type: String, required: [true, 'Please add a product name'] },
    sku: { type: String, required: [true, 'Please add an SKU'] },
    category: { type: String, required: [true, 'Please add a category'] },
    quantity: { 
        type: Number, 
        required: [true, 'Please add a quantity'],
        min: [0, 'Quantity cannot be negative'] 
    },
    minStockLevel: { 
        type: Number, 
        required: [true, 'Please add a minimum stock level'],
        default: 10
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
    supplier: { type: String, required: [true, 'Please add a supplier'] },
    image: { 
        type: String, 
        default: 'https://via.placeholder.com/150?text=No+Image' 
    }
}, {
    timestamps: true
});

// Pre-save hook for business logic and auto-generation
productSchema.pre('save', async function() {
    // 1. Auto-generate Product Code (e.g., ASE-PRD-0001)
    if (this.isNew && !this.productCode) {
        const count = await mongoose.model('Product').countDocuments();
        const paddedCount = (count + 1).toString().padStart(4, '0');
        this.productCode = `ASE-PRD-${paddedCount}`;
    }

    // 2. Business Logic Validation: Selling Price >= Purchase Price
    if (this.sellingPrice < this.purchasePrice) {
        throw new Error('Selling Price cannot be lower than Purchase Price');
    }
});

module.exports = mongoose.model('Product', productSchema);