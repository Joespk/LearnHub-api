"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreationError = void 0;
class UserCreationError extends Error {
    constructor(type, column) {
        super();
        this.type = type;
        this.column = column;
    }
}
exports.UserCreationError = UserCreationError;
