import { PrismaClient } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.users.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
    });
  }
}
