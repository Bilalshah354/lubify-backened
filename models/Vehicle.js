
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    engineNumber: { type: String, required: true, unique: true },
    vehicleName: { type: String, required: true },
    company: { type: String, required: true },
    model: { type: String, required: true },
    modelYear: { type: Number, required: true },
    color: { type: String, required: true }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
