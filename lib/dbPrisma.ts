import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-expect-error bypass
  if (!global.prisma) {
  // @ts-expect-error bypass
    global.prisma = new PrismaClient();
  }
  // @ts-expect-error bypass
  prisma = global.prisma;
}

export default prisma;