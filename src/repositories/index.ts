import { Content, Users } from "@prisma/client";
import { ICreateUserDto } from "../dto/user";
import { ICreateContentDto, IUpdateContentDto } from "../dto/content";

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

export interface IBlacklistRepository {
  addToBlacklist(token: string, exp: number): Promise<void>;
  isAlreadyBlacklisted(token: string): Promise<boolean>;
}

export interface ICreateContent
  extends Omit<Content, "ownerId" | "id" | "createdAt" | "updatedAt"> {}

export interface IContent extends Content {
  Users: IUser;
}

export interface IContentRepository {
  create(ownerId: string, content: ICreateContent): Promise<IContent>;
  getAll(): Promise<IContent[]>;
  getById(id: number): Promise<IContent>;
  deleteById(id: number): Promise<IContent>;
  updateById(id: number, data: IUpdateContentDto): Promise<IContent>;
}
