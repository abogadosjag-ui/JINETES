const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
});

async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        emergencyContact: true, experienceLevel: true, avatarUrl: true, createdAt: true,
      },
    });
    res.json(user);
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        emergencyContact: true, experienceLevel: true, createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
}

// ── Admin ───────────────────────────────────────────────

async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true, name: true, email: true, phone: true,
        experienceLevel: true, isActive: true, inactiveSince: true, createdAt: true,
        _count: { select: { payments: true, classBookings: true, cabalgatas: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
}

async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, phone: true, emergencyContact: true,
        experienceLevel: true, isActive: true, inactiveSince: true, createdAt: true,
        payments: { orderBy: { createdAt: 'desc' } },
        classBookings: { include: { slot: true }, orderBy: { createdAt: 'desc' } },
        cabalgatas: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json(user);
  } catch (err) { next(err); }
}

// Admin: activa o inactiva un alumno
async function toggleUserStatus(req, res, next) {
  try {
    const current = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { isActive: true },
    });
    if (!current) return res.status(404).json({ error: 'Usuario no encontrado' });

    const newActive = !current.isActive;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        isActive: newActive,
        inactiveSince: newActive ? null : new Date(),
      },
      select: { id: true, isActive: true, inactiveSince: true },
    });
    res.json(user);
  } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile, getAllUsers, getUserById, toggleUserStatus };
