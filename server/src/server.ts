import express, { Request, Response } from "express";
import { PrismaClient as UserClient } from "@prisma/client";
import UserController from "./UserController";

const app = express()
const port = process.env.PORT || 8080

const client = new UserClient();

const controller = new UserController(client)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, PUT, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "content-type, accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method.toUpperCase() === "OPTIONS") {
        res.statusCode = 204;
        res.setHeader("Content-Length", 0);
        res.end();
        return;
      }
    next();
})

app.use(express.json());

(async () => {
    await client.$connect();

    app.post("/api/v1/signup", (req, res) => controller.createUser(req, res))
    app.post("/api/v1/signin", (req, res) => controller.loginUser(req, res))
})();


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})