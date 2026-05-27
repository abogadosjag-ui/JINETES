const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const createSchema = z.object({
  date: z.string().datetime(),
  numPeople: z.coerce.number().int().min(1).max(30),
  notes: z.string().optional(),
});

async function createCabalgata(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const cabalgata = await prisma.cabalgata.create({
      data: { ...data, userId: req.user.id, date: new Date(data.date) },
    });
    res.status(201).json(cabalgata);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

async function getMyCabalgatas(req, res, next) {
  try {
    const list = await prisma.cabalgata.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'asc' },
    });
    res.json(list);
  } catch (err) { next(err); }
}

// Admin
async function getAllCabalgatas(req, res, next) {
  try {
    const list = await prisma.cabalgata.findMany({
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { date: 'asc' },
    });
    res.json(list);
  } catch (err) { next(err); }
}

async function updateCabalgata(req, res, next) {
  try {
    const { status, adminNotes } = req.body;
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const cabalgata = await prisma.cabalgata.update({
      where: { id: req.params.id },
      data: { status, adminNotes },
    });
    res.json(cabalgata);
  } catch (err) { next(err); }
}

module.exports = { createCabalgata, getMyCabalgatas, getAllCabalgatas, updateCabalgata };
