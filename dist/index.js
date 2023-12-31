"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const user_1 = __importDefault(require("./repositories/user"));
const user_2 = __importDefault(require("./handlers/user"));
const jwt_1 = __importDefault(require("./middleware/jwt"));
const content_1 = __importDefault(require("./handlers/content"));
const content_2 = __importDefault(require("./repositories/content"));
const cors_1 = __importDefault(require("cors"));
const blacklist_1 = __importDefault(require("./repositories/blacklist"));
const redis_1 = require("redis");
const const_1 = require("./const");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 8888);
const clnt = new client_1.PrismaClient();
const redisClnt = (0, redis_1.createClient)({
    url: const_1.REDIS_URL,
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
const blacklistRepo = new blacklist_1.default(redisClnt);
const userRepo = new user_1.default(clnt);
const contentRepo = new content_2.default(clnt);
const userHandler = new user_2.default(userRepo, blacklistRepo);
const contentHandler = new content_1.default(contentRepo);
const jwtMiddleware = new jwt_1.default(blacklistRepo);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", jwtMiddleware.auth, (req, res) => {
    console.log(res.locals);
    return res.status(200).send("Welcome to LearnHub").end();
});
const userRouter = express_1.default.Router();
app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);
userRouter.get("/:username", userHandler.getByusername);
const authRouter = express_1.default.Router();
app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);
const contentRouter = express_1.default.Router();
app.use("/content", contentRouter);
contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getById);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);
app.listen(PORT, () => {
    console.log(`LearnHub API v+0.0.5 is up at ${PORT}`);
});
