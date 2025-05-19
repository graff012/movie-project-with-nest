import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  const requiredEnvVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_EMAIL'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) {
    throw new Error('ADMIN_USERNAME environment variable is required');
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL environment variable is required');
  }

  const admin = await prisma.user.create({
    data: {
      username: adminUsername,
      fullname: adminUsername,
      password: hashedPassword,
      email: adminEmail,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Admin user created successfully:', admin);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
