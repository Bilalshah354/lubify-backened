
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);

router.post('/create', auth, userController.createUser);
router.put('/update/:id', auth, userController.updateUser);
router.delete('/delete/:id', auth, userController.deleteUser);
// Forget password route
router.post('/forget-password', userController.forgetPassword);

// Reset password route
router.post('/reset-password', userController.resetPassword);
router.post('/shopify-signup', userController.shopifySignUp);
module.exports = router;
