const express = require('express');
const router = express.Router();
const {
    addReview,
    getServiceReviews,
    deleteReview,
} = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.post('/', authMiddleware, roleMiddleware('user'), addReview);
router.get('/service/:id', getServiceReviews);                          // public
router.delete('/:id', authMiddleware, deleteReview);                    // owner or admin

module.exports = router;