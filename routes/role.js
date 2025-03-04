
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');

router.post('/create', auth, roleController.createRole);
router.put('/update/:id', auth, roleController.updateRole);
router.delete('/delete/:id', auth, roleController.deleteRole);
router.post('/assign-permissions/:id', auth, roleController.assignPermissions);
router.post('/assign-role/:userId/:roleId', auth, roleController.assignRoleToUser);

module.exports = router;
