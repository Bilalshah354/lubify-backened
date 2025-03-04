
const mongoose = require('mongoose');

const OilChangeSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    oilChangeDate: { type: Date, required: true },
    oilChangeReading: { type: Number, required: true }
});

module.exports = mongoose.model('OilChange', OilChangeSchema);
