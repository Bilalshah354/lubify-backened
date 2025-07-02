const vehicleService = require('../services/vehicleService');

exports.addVehicle = async (req, res) => {
    try {
        if (!req.body.variant) {
            return res.status(400).json({ error: 'Variant is required' });
        }
        const result = await vehicleService.addVehicle(req.body);
        res.status(201).json(result);
    } catch (err) {
        // Handle duplicate key errors with appropriate status codes
        if (err.code && err.code.startsWith('DUPLICATE_')) {
            return res.status(409).json({ 
                error: err.message,
                code: err.code,
                field: err.code.replace('DUPLICATE_', '').toLowerCase()
            });
        }
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        // Handle other errors
        res.status(400).json({ error: err.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        if (!req.body.variant) {
            return res.status(400).json({ error: 'Variant is required' });
        }
        const result = await vehicleService.updateVehicle(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        // Handle duplicate key errors with appropriate status codes
        if (err.code && err.code.startsWith('DUPLICATE_')) {
            return res.status(409).json({ 
                error: err.message,
                code: err.code,
                field: err.code.replace('DUPLICATE_', '').toLowerCase()
            });
        }
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        // Handle other errors
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

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        res.json(vehicle);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
