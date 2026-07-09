const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false // This ensures the password isn't accidentally sent back in API responses
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Employee'],
        default: 'Employee' // Default role for new signups
    }
}, { timestamps: true });

// Viva Defense Prep: Mongoose Middleware to hash the password BEFORE saving it
userSchema.pre('save', async function(next) {
    // If the password hasn't been modified, skip hashing
    if (!this.isModified('password')) {
        return next();
    }
    
    // Generate a secure salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Viva Defense Prep: Helper method to compare passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);