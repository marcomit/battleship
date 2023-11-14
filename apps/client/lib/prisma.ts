import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}
if (!global.cachedPrisma) {
  global.cachedPrisma = new PrismaClient();
}
let prisma: PrismaClient = global.cachedPrisma;
export const db = prisma;
