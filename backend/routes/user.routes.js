const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getProviders,
} = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/providers', getProviders);   // public — no auth needed

module.exports = router;