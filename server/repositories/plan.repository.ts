import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PlanRepository {
  async findById(id: string, select?: Prisma.PlansSelect) {
    return prisma.plans.findUnique({
      where: { id },
      select,
    });
  }
}
