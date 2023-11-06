import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentHandler from "./handlers/content";
import ContentRepository from "./repositories/content";

const app = express();
const PORT = Number(process.env.PORT || 8888);
const clnt = new PrismaClient();

const userRepo: IUserRepository = new UserRepository(clnt);
const contentRepo: IContentRepository = new ContentRepository(clnt);

const userHandler: IUserHandler = new UserHandler(userRepo);

const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware();

app.use(express.json());
app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);
userRouter.get("/:username", userHandler.getByusername);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.post("/login", userHandler.login);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getById);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT}`);
});
