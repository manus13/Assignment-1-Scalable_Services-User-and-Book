const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetOTP: String,  // New field for OTP
    resetOTPExpires: Date,  // Expiry time for OTP
    phone: { type: String }, // New field for phone number
    address: { type: String }, // New field for address
    paymentMethod: { type: String }, // New field for payment method
    pincode: { type: String }, // New field for pincode
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
