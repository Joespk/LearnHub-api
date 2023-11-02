import { Users } from "@prisma/client";
import { ICreateUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

//export interface IUserExtended extents Pick<User,"id"|"name"|"username"|registeredAT>{}

type CreationErrorType = "UNIQUE";

export class UserCreationError extends Error {
  constructor(
    public readonly type: CreationErrorType,
    public readonly column: string
  ) {
    super();
  }
}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<Users>;
  findById(id: string): Promise<IUser>;
}
