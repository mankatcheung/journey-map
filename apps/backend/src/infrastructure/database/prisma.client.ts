import { PrismaClient } from '../../generated/prisma/index.js';

export function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  if (url.startsWith('libsql://') || url.startsWith('wss://')) {
    // Turso production: use libSQL adapter
    // Dynamic import to avoid loading adapter in local dev
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSQL } = require('@prisma/adapter-libsql');
    const adapter = new PrismaLibSQL({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local SQLite: Prisma handles it natively via DATABASE_URL
  return new PrismaClient();
}
