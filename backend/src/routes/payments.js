const router = require('express').Router();
const { createPayment, getMyPayments } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('proofFile'), createPayment);
router.get('/mine', authMiddleware, getMyPayments);

module.exports = router;
