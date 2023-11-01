"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 8888);
const clnt = new client_1.PrismaClient();
app.get("/", (req, res) => {
    return res.status(200).send("Welcome to LearnHub").end();
});
app.listen(PORT, () => {
    console.log(`LearnHub API is up at ${PORT}`);
});
