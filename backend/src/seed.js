const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@escuela.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@escuela.com',
      password,
      role: 'ADMIN',
    },
  });
  console.log('Admin creado:', admin.email);
  console.log('Contraseña: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
