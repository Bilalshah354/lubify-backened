
const oilChangeService = require('../services/oilChangeService');

exports.addOilChange = async (req, res) => {
    try {
        const result = await oilChangeService.addOilChange(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getVehicleOilChanges = async (req, res) => {
    try {
        const result = await oilChangeService.getVehicleOilChanges(req.params.carId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
