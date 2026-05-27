const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const createSchema = z.object({
  concept: z.string().min(3, 'Ingresa el concepto del pago'),
  amount: z.coerce.number().positive('El monto debe ser positivo'),
});

async function createPayment(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Debes adjuntar el comprobante de pago' });
    const { concept, amount } = createSchema.parse(req.body);
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        concept,
        amount: parseFloat(amount),
        proofFile: req.file.filename,
      },
    });
    res.status(201).json(payment);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

async function getMyPayments(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (err) { next(err); }
}

// Admin
async function getAllPayments(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (err) { next(err); }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { status, adminNotes } = req.body;
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status, adminNotes },
    });
    res.json(payment);
  } catch (err) { next(err); }
}

module.exports = { createPayment, getMyPayments, getAllPayments, updatePaymentStatus };
