
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
});

module.exports = mongoose.model('Review', ReviewSchema);
