import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { IErrorDto } from "../dto/Error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUserRepository, UserCreationError } from "../repositories";
import { hashPassword, vetifyPassword } from "../utils/bcrypt";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { JWT_SECRET } from "../const";
import { sign } from "jsonwebtoken";
import { AuthStatus } from "../middleware/jwt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public selfcheck: RequestHandler<
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
        .json({ ...others, registeredAt: registeredAt.toISOString() })
        .end();
    } catch (error) {
      console.error(error);

      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name can't be empty" });
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username can't be empty" });
    if (typeof plainPassword !== "string" || plainPassword.length < 4)
      return res.status(400).json({ message: "password is too short" });
    try {
      const {
        id: createdId,
        name: createdName,
        registeredAt,
        username: createUsername,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      return res
        .status(201)
        .json({
          id: createdId,
          name: createdName,
          registeredAt: `${registeredAt}`,
          username: createUsername,
        })
        .end();
    } catch (error) {
      if (error instanceof UserCreationError) {
        return res.status(500).json({
          message: `${error.column} is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
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
}
