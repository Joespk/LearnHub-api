"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER_SELECT = exports.JWT_SECRET = void 0;
const { JWT_SECRET: ENV_JWT_SECRET } = process.env;
if (!ENV_JWT_SECRET)
    throw new Error("Environment variable: JWT_SECRET is not configured");
exports.JWT_SECRET = ENV_JWT_SECRET;
exports.DEFAULT_USER_SELECT = {
    id: true,
    name: true,
    username: true,
    registeredAt: true,
};
//export const REQUIRED_RECORD_NOT_FOUND =
