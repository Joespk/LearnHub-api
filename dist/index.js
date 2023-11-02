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
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 8888);
const clnt = new client_1.PrismaClient();
const userRepo = new user_1.default(clnt);
const userHandler = new user_2.default(userRepo);
const jwtMiddleware = new jwt_1.default();
app.use(express_1.default.json());
app.get("/", jwtMiddleware.auth, (req, res) => {
    console.log(res.locals);
    return res.status(200).send("Welcome to LearnHub").end();
});
const userRouter = express_1.default.Router();
app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);
const authRouter = express_1.default.Router();
app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.get("/me", jwtMiddleware.auth, userHandler.selfcheck);
app.listen(PORT, () => {
    console.log(`LearnHub API is up at ${PORT}`);
});
