const router = require('express').Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAllUsers, getUserById } = require('../controllers/userController');
const { getAllPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { createSlot, deleteSlot, getSlotDetail } = require('../controllers/classController');
const { getAllCabalgatas, updateCabalgata } = require('../controllers/cabalgataController');

router.use(authMiddleware, adminMiddleware);

// Usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Pagos
router.get('/payments', getAllPayments);
router.put('/payments/:id', updatePaymentStatus);

// Clases
router.post('/classes', createSlot);
router.delete('/classes/:id', deleteSlot);
router.get('/classes/:id', getSlotDetail);

// Cabalgatas
router.get('/cabalgatas', getAllCabalgatas);
router.put('/cabalgatas/:id', updateCabalgata);

module.exports = router;
