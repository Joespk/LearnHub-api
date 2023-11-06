"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const const_1 = require("../const");
class JWTMiddleware {
    constructor() {
        this.auth = (req, res, next) => {
            try {
                const token = req.header("Authorization").replace("Bearer ", "").trim();
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
        };
    }
}
exports.default = JWTMiddleware;
