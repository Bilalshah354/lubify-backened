
const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (vehicleData) => {
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    return 'Vehicle added';
};

exports.updateVehicle = async (id, data) => {
    await Vehicle.findByIdAndUpdate(id, data);
    return 'Vehicle updated';
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
