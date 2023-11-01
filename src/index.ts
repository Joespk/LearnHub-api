import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = Number(process.env.PORT || 8888);
const clnt = new PrismaClient();

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT}`);
});
