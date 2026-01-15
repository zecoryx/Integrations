// @ts-nocheck

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Executes a function within a Prisma transaction.
 * @param fn The function to execute. It receives the transaction client as an argument.
 * @returns The result of the function.
 */
export async function executeTransaction<T>(
  fn: (prisma: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(fn);
}
