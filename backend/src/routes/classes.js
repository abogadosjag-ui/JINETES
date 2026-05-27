const router = require('express').Router();
const { getSlots, bookSlot, cancelBooking } = require('../controllers/classController');
const { authMiddleware } = require('../middleware/auth');

// GET es público pero si hay token lo usamos para indicar si el usuario ya reservó
router.get('/', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    try { req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET); } catch {}
  }
  next();
}, getSlots);

router.post('/book/:slotId', authMiddleware, bookSlot);
router.delete('/book/:slotId', authMiddleware, cancelBooking);

module.exports = router;
