
const express = require('express');
const router = express.Router();
const oilChangeController = require('../controllers/oilChangeController');
const auth = require('../middleware/auth');

router.post('/add', auth, oilChangeController.addOilChange);
router.get('/vehicle/:carId', auth, oilChangeController.getVehicleOilChanges);

module.exports = router;
