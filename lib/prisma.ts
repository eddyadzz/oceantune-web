import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Construct the client lazily. If DATABASE_URL is not configured (e.g. during
// a build) `prisma` is undefined and callers fall back to seed/default data.
export const prisma: PrismaClient | undefined = process.env.DATABASE_URL
  ? globalForPrisma.prisma ?? new PrismaClient()
  : undefined;

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}