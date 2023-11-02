import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/Error";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  selfcheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}
