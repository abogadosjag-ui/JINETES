const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const slotSchema = z.object({
  title: z.string().min(2),
  instructor: z.string().min(2),
  dateTime: z.string().datetime(),
  duration: z.coerce.number().int().positive(),
  maxStudents: z.coerce.number().int().positive().default(5),
});

// GET /classes — admin ve todo, alumno solo sus clases asignadas
async function getSlots(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' });

    if (req.user.role === 'ADMIN') {
      const slots = await prisma.classSlot.findMany({
        include: { bookings: { where: { status: 'CONFIRMED' }, select: { id: true, userId: true } } },
        orderBy: { dateTime: 'asc' },
      });
      const result = slots.map(slot => ({
        ...slot,
        bookedCount: slot.bookings.length,
        available: slot.bookings.length < slot.maxStudents,
        userBooked: false,
        bookings: undefined,
      }));
      return res.json(result);
    } else {
      // Alumno: solo los slots donde tiene una reserva CONFIRMED
      const bookings = await prisma.classBooking.findMany({
        where: { userId: req.user.id, status: 'CONFIRMED' },
        include: { slot: true },
        orderBy: { slot: { dateTime: 'asc' } },
      });
      const result = bookings.map(b => ({
        ...b.slot,
        bookedCount: 1,
        available: false,
        userBooked: true,
      }));
      return res.json(result);
    }
  } catch (err) { next(err); }
}

// Reserva propia del alumno — se mantiene pero ya no se expone en el front
async function bookSlot(req, res, next) {
  try {
    const slot = await prisma.classSlot.findUnique({
      where: { id: req.params.slotId },
      include: { bookings: { where: { status: 'CONFIRMED' } } },
    });
    if (!slot) return res.status(404).json({ error: 'Clase no encontrada' });
    if (slot.bookings.length >= slot.maxStudents) {
      return res.status(409).json({ error: 'Esta clase ya no tiene cupos disponibles' });
    }
    const booking = await prisma.classBooking.create({
      data: { userId: req.user.id, slotId: req.params.slotId },
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Ya tienes reserva en esta clase' });
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    await prisma.classBooking.updateMany({
      where: { userId: req.user.id, slotId: req.params.slotId },
      data: { status: 'CANCELLED' },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

// ── Admin ───────────────────────────────────────────────

async function createSlot(req, res, next) {
  try {
    const data = slotSchema.parse(req.body);
    const slot = await prisma.classSlot.create({ data: { ...data, dateTime: new Date(data.dateTime) } });
    res.status(201).json(slot);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

async function deleteSlot(req, res, next) {
  try {
    await prisma.classBooking.deleteMany({ where: { slotId: req.params.id } });
    await prisma.classSlot.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function getSlotDetail(req, res, next) {
  try {
    const slot = await prisma.classSlot.findUnique({
      where: { id: req.params.id },
      include: {
        bookings: {
          where: { status: 'CONFIRMED' },
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    if (!slot) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json(slot);
  } catch (err) { next(err); }
}

// Admin asigna un alumno a un slot
async function assignStudent(req, res, next) {
  try {
    const { userId } = req.body;
    const slotId = req.params.id;

    if (!userId) return res.status(400).json({ error: 'userId es requerido' });

    const slot = await prisma.classSlot.findUnique({
      where: { id: slotId },
      include: { bookings: { where: { status: 'CONFIRMED' } } },
    });
    if (!slot) return res.status(404).json({ error: 'Clase no encontrada' });
    if (slot.bookings.length >= slot.maxStudents) {
      return res.status(409).json({ error: 'La clase ya esta llena' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Upsert: si existia cancelada, la reactiva
    const booking = await prisma.classBooking.upsert({
      where: { userId_slotId: { userId, slotId } },
      update: { status: 'CONFIRMED' },
      create: { userId, slotId, status: 'CONFIRMED' },
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'El alumno ya esta asignado a esta clase' });
    next(err);
  }
}

// Admin quita un alumno de un slot
async function unassignStudent(req, res, next) {
  try {
    await prisma.classBooking.updateMany({
      where: { slotId: req.params.id, userId: req.params.userId },
      data: { status: 'CANCELLED' },
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = {
  getSlots, bookSlot, cancelBooking,
  createSlot, deleteSlot, getSlotDetail,
  assignStudent, unassignStudent,
};
