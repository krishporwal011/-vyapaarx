const { PrismaClient } = require('@prisma/client');

// Singleton pattern: reuse the same client across hot-reloads in dev
// and prevent connection pool exhaustion on long-running Render instances.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
