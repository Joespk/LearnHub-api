import { RequestHandler } from "express";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { IContentDto, IContentsDto, ICreateContentDto } from "../dto/content";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";
import { IErrorDto } from "../dto/Error";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  getPersonalInfo: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
  getByusername: RequestHandler<{ username: string }, IUserDto | IErrorDto>;
}

export interface IContentHandler {
  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  >;
  getAll: RequestHandler<{}, IContentsDto>;
  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto>;
  deleteById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  >;
}
