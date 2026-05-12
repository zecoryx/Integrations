import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findById(id: string, select?: Prisma.UsersSelect) {
    return prisma.users.findUnique({
      where: { id },
      select,
    });
  }

  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }
}
