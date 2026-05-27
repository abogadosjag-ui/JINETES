const router = require('express').Router();
const { createCabalgata, getMyCabalgatas } = require('../controllers/cabalgataController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createCabalgata);
router.get('/mine', authMiddleware, getMyCabalgatas);

module.exports = router;
