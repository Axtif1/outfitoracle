const express = require('express');
const router = express.Router();
const { getStats, getUsers, getTryOns, addCredits } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/tryons', getTryOns);
router.post('/credits', addCredits);

module.exports = router;
