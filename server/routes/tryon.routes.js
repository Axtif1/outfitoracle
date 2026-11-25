const express = require('express');
const router = express.Router();
const { processTryOn } = require('../controllers/tryon.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, processTryOn);

module.exports = router;
