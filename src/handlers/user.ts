import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { IUserHandler } from ".";
import { JWT_SECRET } from "../const";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";
import { IUserRepository } from "../repositories";
import { hashPassword, vetifyPassword } from "../utils/bcrypt";
import { IErrorDto } from "../dto/Error";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  public getPersonalInfo: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const { registeredAt, ...others } = await this.repo.findById(
        res.locals.user.id
      );

      return res
        .status(200)
        .json({
          ...others,
          registeredAt: registeredAt.toISOString(),
        })
        .end();
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .send({
          message: "Internal Server Error",
        })
        .end();
    }
  };

  public login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        const { password, id } = await this.repo.findByUsername(username);

        if (!vetifyPassword(plainPassword, password))
          throw new Error("Invalid username or password");

        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "learnhub-api",
          subject: "user-credential",
        });

        return res
          .status(200)
          .json({
            accessToken,
          })
          .end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" })
          .end();
      }
    };

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" }).end();
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" }).end();
    if (typeof plainPassword !== "string" || plainPassword.length < 5)
      return res.status(400).json({ message: "password is invalid" }).end();

    try {
      const {
        id: registeredId,
        name: registeredName,
        registeredAt,
        username: registeredUsername,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      return res
        .status(201)
        .json({
          id: registeredId,
          name: registeredName,
          registeredAt: `${registeredAt}`,
          username: registeredUsername,
        })
        .end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res
          .status(500)
          .json({
            message: `name is invalid`,
          })
          .end();
      }
      return res
        .status(500)
        .json({
          message: `Internal Server Error`,
        })
        .end();
    }
  };
  public getByusername: RequestHandler<
    { username: string },
    IUserDto | IErrorDto
  > = async (req, res) => {
    try {
      const { password, registeredAt, ...userInfo } =
        await this.repo.findByUsername(req.params.username);
      return res
        .status(200)
        .json({ ...userInfo, registeredAt: registeredAt.toISOString() })
        .end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2825"
      )
        return res.status(404).end();
    }
  };
}
