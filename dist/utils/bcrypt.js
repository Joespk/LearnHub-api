"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vetifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const hashPassword = (plaintext) => {
    const salt = (0, bcryptjs_1.genSaltSync)(12);
    return (0, bcryptjs_1.hashSync)(plaintext, salt);
};
exports.hashPassword = hashPassword;
const vetifyPassword = (plaintext, hashVal) => (0, bcryptjs_1.compareSync)(plaintext, hashVal);
exports.vetifyPassword = vetifyPassword;
