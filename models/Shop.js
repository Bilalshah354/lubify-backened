// Extend the User model to include password reset fields
const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    shop: { type: String, required: true, unique: true }, 
    salt: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Shop', ShopSchema);