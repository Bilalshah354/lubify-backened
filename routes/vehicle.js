
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const auth = require('../middleware/auth');

router.post('/add', auth, vehicleController.addVehicle);
router.put('/update/:id', auth, vehicleController.updateVehicle);
router.get('/user/:userId', auth, vehicleController.getUserVehicles);
router.delete('/delete/:id', auth, vehicleController.deleteVehicle);

module.exports = router;
