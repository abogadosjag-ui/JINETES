const router = require('express').Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAllUsers, getUserById, toggleUserStatus } = require('../controllers/userController');
const { getAllPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { createSlot, deleteSlot, getSlotDetail, assignStudent, unassignStudent } = require('../controllers/classController');
const { getAllCabalgatas, updateCabalgata } = require('../controllers/cabalgataController');

router.use(authMiddleware, adminMiddleware);

// Usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', toggleUserStatus);

// Pagos
router.get('/payments', getAllPayments);
router.put('/payments/:id', updatePaymentStatus);

// Clases
router.post('/classes', createSlot);
router.delete('/classes/:id', deleteSlot);
router.get('/classes/:id', getSlotDetail);
router.post('/classes/:id/assign', assignStudent);
router.delete('/classes/:id/assign/:userId', unassignStudent);

// Cabalgatas
router.get('/cabalgatas', getAllCabalgatas);
router.put('/cabalgatas/:id', updateCabalgata);

module.exports = router;
