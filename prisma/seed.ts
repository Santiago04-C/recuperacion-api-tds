import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // Hash de contraseñas
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Crear usuario admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {},
    create: {
      email: 'admin@local.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear usuario normal
  const user = await prisma.user.upsert({
    where: { email: 'user@local.com' },
    update: {},
    create: {
      email: 'user@local.com',
      name: 'Normal User',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('✅ Usuario normal creado:', user.email);

  // Crear algunos productos de ejemplo
  await prisma.product.create({
    data: {
      name: 'Laptop Dell XPS 15',
      description: 'Laptop de alto rendimiento',
      price: 1299.99,
      stock: 10,
      userId: admin.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Mouse Logitech MX Master',
      description: 'Mouse ergonómico inalámbrico',
      price: 99.99,
      stock: 25,
      userId: user.id,
    },
  });

  console.log('✅ Productos de ejemplo creados');
  console.log('\n📋 Usuarios de prueba:');
  console.log('   Admin: admin@local.com / 123456');
  console.log('   User:  user@local.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
