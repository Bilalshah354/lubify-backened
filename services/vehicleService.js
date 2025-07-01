const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (vehicleData) => {
    try {
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        return 'Vehicle added';
    } catch (error) {
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            
            if (field === 'engineNumber') {
                message = 'Engine number already exists. Please use a different engine number.';
            } else if (field === 'userId') {
                message = 'User ID already exists. Please use a different user ID.';
            } else {
                message = `Duplicate value for field: ${field}`;
            }
            
            const customError = new Error(message);
            customError.code = `DUPLICATE_${field.toUpperCase()}`;
            throw customError;
        }
        
        // Handle custom duplicate errors from pre-save middleware
        if (error.code === 'DUPLICATE_ENGINE_NUMBER') {
            throw error;
        }
        
        throw error;
    }
};

exports.updateVehicle = async (id, data) => {
    try {
        await Vehicle.findByIdAndUpdate(id, data, { runValidators: true, new: true });
        return 'Vehicle updated';
    } catch (error) {
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            
            if (field === 'engineNumber') {
                message = 'Engine number already exists. Please use a different engine number.';
            } else if (field === 'userId') {
                message = 'User ID already exists. Please use a different user ID.';
            } else {
                message = `Duplicate value for field: ${field}`;
            }
            
            const customError = new Error(message);
            customError.code = `DUPLICATE_${field.toUpperCase()}`;
            throw customError;
        }
        
        throw error;
    }
};

exports.getUserVehicles = async (userId) => {
    const vehicles = await Vehicle.find({ userId });
    if (vehicles.length === 0) throw new Error('No vehicles found');
    return vehicles;
};

exports.deleteVehicle = async (id) => {
    await Vehicle.findByIdAndDelete(id);
    return 'Vehicle deleted';
};

exports.getVehicleById = async (id) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
};
