
const reviewService = require('../services/reviewService');

exports.addReview = async (req, res) => {
    try {
        const result = await reviewService.addReview(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const result = await reviewService.getUserReviews(req.params.userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
