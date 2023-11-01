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
const bcrypt_1 = require("../utils/bcrypt");
class UserHandler {
    constructor(repo) {
        this.registration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, username, password: plainPassword } = req.body;
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
            //const plainPassword = req.body.password;
        });
        this.repo = repo;
    }
}
exports.default = UserHandler;
