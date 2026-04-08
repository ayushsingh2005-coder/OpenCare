const express = require('express');
const router = express.Router();
const {
    getProviderDashboard,
    getMyServices,
    getEarningsBreakdown,
} = require('../controllers/provider.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes — provider only
router.use(authMiddleware, roleMiddleware('provider'));

router.get('/dashboard', getProviderDashboard);
router.get('/my-services', getMyServices);
router.get('/earnings', getEarningsBreakdown);

module.exports = router;