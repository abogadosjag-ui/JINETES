const router = require('express').Router();
const { getSlots, bookSlot, cancelBooking } = require('../controllers/classController');
const { authMiddleware } = require('../middleware/auth');

// Todos los endpoints requieren autenticacion
router.get('/', authMiddleware, getSlots);
router.post('/book/:slotId', authMiddleware, bookSlot);
router.delete('/book/:slotId', authMiddleware, cancelBooking);

module.exports = router;
