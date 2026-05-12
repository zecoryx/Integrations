import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TransactionRepository {
  async findByTransId(transId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    return prismaInstance.transactions.findUnique({
      where: { transId },
    });
  }

  async findByPrepareId(prepareId: number, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    return prismaInstance.transactions.findFirst({
      where: { prepareId },
    });
  }

  async create(data: Prisma.TransactionsCreateInput, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    return prismaInstance.transactions.create({ data });
  }

  async update(id: string, data: Prisma.TransactionsUpdateInput, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    return prismaInstance.transactions.update({
      where: { id },
      data,
    });
  }

  async updateByTransId(transId: string, data: Prisma.TransactionsUpdateInput, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    return prismaInstance.transactions.update({
      where: { transId },
      data,
    });
  }

  async findMany(where: Prisma.TransactionsWhereInput, select?: Prisma.TransactionsSelect) {
    return prisma.transactions.findMany({ where, select });
  }

  async findFirst(where: Prisma.TransactionsWhereInput) {
    return prisma.transactions.findFirst({ where });
  }
}
