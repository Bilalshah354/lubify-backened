
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    shopifyProductId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number },
    vendor: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);
