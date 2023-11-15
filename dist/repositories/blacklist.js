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
const const_1 = require("../const");
class BlacklistRepository {
    constructor(clnt) {
        this.clnt = clnt;
    }
    addToBlacklist(token, exp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clnt.SET(`${const_1.BLACKLIST_REDIS_KEY_PREFIX}${token}`, const_1.BLACKLIST_REDIS_VALUE);
            yield this.clnt.EXPIREAT(`${const_1.BLACKLIST_REDIS_KEY_PREFIX}${token}`, exp);
            return;
        });
    }
    isAlreadyBlacklisted(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = yield this.clnt.GET(`${const_1.BLACKLIST_REDIS_KEY_PREFIX}${token}`);
            return val === const_1.BLACKLIST_REDIS_VALUE;
        });
    }
}
exports.default = BlacklistRepository;
