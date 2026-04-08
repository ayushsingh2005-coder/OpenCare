const express = require('express');
const router = express.Router();
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} = require('../controllers/service.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', getAllServices);                                                          // public
router.get('/:id', getServiceById);                                                      // public
router.post('/', authMiddleware, roleMiddleware('provider', 'admin'), createService);    // provider only
router.put('/:id', authMiddleware, updateService);                                       // owner only
router.delete('/:id', authMiddleware, deleteService);                                    // owner or admin

module.exports = router;