const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    engineNumber: { type: String, required: true, unique: true },
    vehicleName: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    modelYear: { type: Number, required: true },
    color: { type: String, required: true },
    variant: { type: String, required: true },
    image: { type: String, required: false }
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

// Pre-save middleware to handle duplicate key errors
VehicleSchema.pre('save', function(next) {
    const vehicle = this;
    
    // Check for duplicate engineNumber
    Vehicle.findOne({ engineNumber: vehicle.engineNumber, _id: { $ne: vehicle._id } })
        .then(existingVehicle => {
            if (existingVehicle) {
                const error = new Error('License plate number already exists. Please use a different license plate number.');
                error.code = 'DUPLICATE_LICENSE_PLATE_NUMBER';
                return next(error);
            }
            next();
        })
        .catch(err => next(err));
});

module.exports = Vehicle;
