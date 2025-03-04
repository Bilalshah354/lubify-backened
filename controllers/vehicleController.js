
const vehicleService = require('../services/vehicleService');

exports.addVehicle = async (req, res) => {
    try {
        const result = await vehicleService.addVehicle(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const result = await vehicleService.updateVehicle(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserVehicles = async (req, res) => {
    try {
        const result = await vehicleService.getUserVehicles(req.params.userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const result = await vehicleService.deleteVehicle(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
