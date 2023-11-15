import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentHandler from "./handlers/content";
import ContentRepository from "./repositories/content";
import cors from "cors";
import BlacklistRepository from "./repositories/blacklist";
import { RedisClientType, createClient } from "redis";
import { REDIS_URL } from "./const";

const app = express();
const PORT = Number(process.env.PORT || 8888);
const clnt = new PrismaClient();

const redisClnt: RedisClientType = createClient({
  url: REDIS_URL,
});

clnt
  .$connect()
  .then(() => redisClnt.connect())
  .catch((err) => {
    console.error("Error", err);
  });
redisClnt.on("ready", function () {
  console.log("Connected to Redis server successfully");
});

const blacklistRepo = new BlacklistRepository(redisClnt);

const userRepo = new UserRepository(clnt);
const contentRepo: IContentRepository = new ContentRepository(clnt);

const userHandler: IUserHandler = new UserHandler(userRepo, blacklistRepo);

const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware(blacklistRepo);

app.use(cors());

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
authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getById);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);

app.listen(PORT, () => {
  console.log(`LearnHub API v+0.0.5 is up at ${PORT}`);
});
