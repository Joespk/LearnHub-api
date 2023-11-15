"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLACKLIST_REDIS_VALUE = exports.BLACKLIST_REDIS_KEY_PREFIX = exports.getAuthToken = exports.UNIQUE_CONSTRAINT_VIOLATION = exports.REQUIRED_RECORD_NOT_FOUND = exports.DEFAULT_USER_SELECT = exports.REDIS_URL = exports.JWT_SECRET = void 0;
const { JWT_SECRET: ENV_JWT_SECRET, REDIS_URL: ENV_REDIS_URL } = process.env;
if (!ENV_JWT_SECRET)
    throw new Error("Environment variable: JWT_SECRET is not configured");
exports.JWT_SECRET = ENV_JWT_SECRET;
exports.REDIS_URL = ENV_REDIS_URL !== null && ENV_REDIS_URL !== void 0 ? ENV_REDIS_URL : "redis://localhost:6379";
exports.DEFAULT_USER_SELECT = {
    id: true,
    name: true,
    username: true,
    registeredAt: true,
};
exports.REQUIRED_RECORD_NOT_FOUND = "P2025";
exports.UNIQUE_CONSTRAINT_VIOLATION = "P2002";
const getAuthToken = (authorizationHeader) => authorizationHeader.replace("Bearer ", "").trim();
exports.getAuthToken = getAuthToken;
exports.BLACKLIST_REDIS_KEY_PREFIX = "bl_";
exports.BLACKLIST_REDIS_VALUE = "1";
//export const REQUIRED_RECORD_NOT_FOUND =
