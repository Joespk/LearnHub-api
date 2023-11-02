"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const { JWT_SECRET: ENV_JWT_SECRET } = process.env;
if (!ENV_JWT_SECRET)
    throw new Error("Environment variable: JWT_SECRET is not configured");
exports.JWT_SECRET = ENV_JWT_SECRET;
