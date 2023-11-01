import { ICreateUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

//export interface IUserExtended extents Pick<User,"id"|"name"|"username"|registeredAT>{}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
}
