const sourceItService = require('../services/sourceItService');

exports.submitSourceIt = async (req, res) => {
    try {
        const result = await sourceItService.submitSourceIt(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
