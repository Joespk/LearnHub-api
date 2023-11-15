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
const jsonwebtoken_1 = require("jsonwebtoken");
const const_1 = require("../const");
class JWTMiddleware {
    constructor(userRepo) {
        this.auth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header("Authorization").replace("Bearer ", "").trim();
                const isBlacklisted = yield this.blacklistRepo.isAlreadyBlacklisted(token);
                if (isBlacklisted)
                    throw new jsonwebtoken_1.JsonWebTokenError(`Token: ${token} is blacklisted`);
                const { id } = (0, jsonwebtoken_1.verify)(token, const_1.JWT_SECRET);
                res.locals = {
                    user: {
                        id,
                    },
                };
                return next();
            }
            catch (error) {
                console.error(error);
                if (error instanceof TypeError)
                    return res.status(401).send("Authorization header is expected").end();
                if (error instanceof jsonwebtoken_1.JsonWebTokenError)
                    return res.status(403).send("Token is invalid").end();
                return res.status(500).send("Internal Server Error").end();
            }
        });
        this.blacklistRepo = userRepo;
    }
}
exports.default = JWTMiddleware;
