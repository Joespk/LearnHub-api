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
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const bcrypt_1 = require("../utils/bcrypt");
class UserHandler {
    constructor(repo) {
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, username, password: plainPassword } = req.body;
            if (typeof name !== "string" || name.length === 0)
                return res.status(400).json({ message: "name can't be empty" });
            if (typeof username !== "string" || username.length === 0)
                return res.status(400).json({ message: "username can't be empty" });
            if (typeof plainPassword !== "string" || plainPassword.length < 4)
                return res.status(400).json({ message: "password is too short" });
            try {
                const { id: createdId, name: createdName, registeredAt, username: createUsername, } = yield this.repo.create({
                    name,
                    username,
                    password: (0, bcrypt_1.hashPassword)(plainPassword),
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
            }
            catch (error) {
                if (error instanceof repositories_1.UserCreationError) {
                    return res.status(500).json({
                        message: `${error.column} is invalid`,
                    });
                }
                return res.status(500).json({
                    message: `Internal Server Error`,
                });
            }
        });
        this.repo = repo;
    }
}
exports.default = UserHandler;
