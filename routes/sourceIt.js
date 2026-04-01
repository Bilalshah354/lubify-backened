const express = require('express');
const router = express.Router();
const sourceItController = require('../controllers/sourceItController');

router.post('/submit', sourceItController.submitSourceIt);

module.exports = router;
