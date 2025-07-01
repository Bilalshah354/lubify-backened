
const mongoose = require('mongoose');

const OilChangeSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    oilChangeDate: { type: Date, required: true },
    oilChangeReading: { type: Number, required: true },
    oilName: { type: String, required: true },
    oilType: { type: String, required: true },
    oilChangeNotes: { type: String, required: false },
});

module.exports = mongoose.model('OilChange', OilChangeSchema);
