"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_crypto_1 = require("node:crypto");
const path_1 = require("path");
const sfwPath = (0, path_1.join)(__dirname, "../handlers");
const files = (0, fs_1.readdirSync)(sfwPath);
files.forEach((filename) => {
    const hash = (0, node_crypto_1.createHash)("sha256");
    const data = (0, fs_1.readFileSync)((0, path_1.join)(sfwPath, filename));
    hash.update(data);
    console.log(hash.digest("hex"));
});
