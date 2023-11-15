"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const jsonwebtoken_1 = require("jsonwebtoken");
const const_1 = require("../const");
const bcrypt_1 = require("../utils/bcrypt");
class UserHandler {
    constructor(repo, blacklistRepo) {
        this.getPersonalInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = yield this.repo.findById(res.locals.user.id), { registeredAt } = _a, others = __rest(_a, ["registeredAt"]);
                return res
                    .status(200)
                    .json(Object.assign(Object.assign({}, others), { registeredAt: registeredAt.toISOString() }))
                    .end();
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .send({
                    message: "Internal Server Error",
                })
                    .end();
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.header("Authorization");
                if (!authHeader)
                    return res
                        .status(400)
                        .json({
                        message: "Authorization header is expected",
                    })
                        .end();
                const authToken = (0, const_1.getAuthToken)(authHeader);
                const { exp } = (0, jsonwebtoken_1.verify)(authToken, const_1.JWT_SECRET);
                if (!exp)
                    return res
                        .status(400)
                        .json({
                        message: "JWT is invalid",
                    })
                        .end();
                yield this.blacklistRepo.addToBlacklist(authToken, exp * 1000);
                return res
                    .status(200)
                    .json({
                    message: "You've been logged out",
                })
                    .end();
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({
                    message: "Internal Server Error",
                })
                    .end();
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password: plainPassword } = req.body;
            try {
                const { password, id } = yield this.repo.findByUsername(username);
                if (!(0, bcrypt_1.vetifyPassword)(plainPassword, password))
                    throw new Error("Invalid username or password");
                const accessToken = (0, jsonwebtoken_1.sign)({ id }, const_1.JWT_SECRET, {
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
            }
            catch (error) {
                return res
                    .status(401)
                    .json({ message: "Invalid username or password" })
                    .end();
            }
        });
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, username, password: plainPassword } = req.body;
            if (typeof name !== "string" || name.length === 0)
                return res.status(400).json({ message: "name is invalid" }).end();
            if (typeof username !== "string" || username.length === 0)
                return res.status(400).json({ message: "username is invalid" }).end();
            if (typeof plainPassword !== "string" || plainPassword.length < 5)
                return res.status(400).json({ message: "password is invalid" }).end();
            try {
                const { id: registeredId, name: registeredName, registeredAt, username: registeredUsername, } = yield this.repo.create({
                    name,
                    username,
                    password: (0, bcrypt_1.hashPassword)(plainPassword),
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
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === "P2002") {
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
        });
        this.getByusername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _b = yield this.repo.findByUsername(req.params.username), { password, registeredAt } = _b, userInfo = __rest(_b, ["password", "registeredAt"]);
                return res
                    .status(200)
                    .json(Object.assign(Object.assign({}, userInfo), { registeredAt: registeredAt.toISOString() }))
                    .end();
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === "P2825")
                    return res.status(404).end();
            }
        });
        this.repo = repo;
        this.blacklistRepo = blacklistRepo;
    }
}
exports.default = UserHandler;
