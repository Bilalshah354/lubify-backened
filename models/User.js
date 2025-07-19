// Extend the User model to include password reset fields
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    shopifyId: { type: String },
    firebaseId: { type: String }
});

module.exports = mongoose.model('User', UserSchema);