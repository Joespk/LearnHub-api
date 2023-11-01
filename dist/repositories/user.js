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
const _1 = require(".");
const library_1 = require("@prisma/client/runtime/library");
class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.users.create({
                    data: user,
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        registeredAt: true,
                    },
                });
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === "P2002")
                    throw new _1.UserCreationError("UNIQUE", "username");
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = UserRepository;
