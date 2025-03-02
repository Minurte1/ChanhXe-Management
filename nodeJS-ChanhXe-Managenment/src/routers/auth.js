const express = require('express');
const router = express.Router();
const { refreshToken } = require('../middleware/JWTaction');

router.post('/refresh-token', refreshToken);

module.exports = router;