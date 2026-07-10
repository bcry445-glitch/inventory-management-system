const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// We only route the functions that actually exist in the controller!
router.post('/register', register);
router.post('/login', login);

module.exports = router;