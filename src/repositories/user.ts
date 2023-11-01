import { PrismaClient } from "@prisma/client";
import { IUser, IUserRepository, UserCreationError } from ".";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: ICreateUserDto): Promise<IUser> {
    try {
      return await this.prisma.users.create({
        data: user,
        select: {
          id: true,
          name: true,
          username: true,
          registeredAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new UserCreationError("UNIQUE", "username");

      throw new Error(`${error}`);
    }
  }
}
