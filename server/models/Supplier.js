const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a supplier company name'],
        unique: true
    },
    contactPerson: {
        type: String,
        required: [true, 'Please add a contact person']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a contact phone number']
    },
    address: {
        type: String,
        required: [true, 'Please add a physical address']
    }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);