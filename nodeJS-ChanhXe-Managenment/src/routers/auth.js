const express = require('express');
const router = express.Router();
const { refreshAccessToken } = require('../middleware/JWTaction');

router.post('/refresh-token', refreshAccessToken);

module.exports = router;