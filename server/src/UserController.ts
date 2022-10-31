import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { ClientError } from "./Server/Error";
import { ServerError } from "./Client/Error";
import { Secret, sign } from "jsonwebtoken"
export const SECRET_KEY: Secret = process.env.SECRET_KEY || "budisukasemua"

class UserController {
    protected readonly _user: PrismaClient;

    constructor(user: PrismaClient) {
        this._user = user
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const invalidBody: string[] = [];

        if (req.body.email !== undefined && (typeof req.body.email !== "string" || req.body.email === "")) {
            invalidBody.push("email")
        }

        if (req.body.password !== undefined && (typeof req.body.password !== "string" || req.body.password === "")) {
            invalidBody.push("password")
        }

        if (invalidBody.length > 0) {
            throw new ClientError(400, `Your ${invalidBody.join(", ")} cannot be empty!`)
        }

        let email: string = req.body.email;
        let password: string = await this.hashPassword(req.body.password);

        try {
            await this._user.user.create({
                data: {
                    email,
                    password
                }
            });
    
            res.status(201).json({
                message: `User ${email} created!`
            })
            return;
        } catch(err: unknown) {
            throw new ServerError(500, "Something wrong")
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        const invalidBody: string[] = [];

        if (req.body.email !== undefined && (typeof req.body.email !== "string" || req.body.email === "")) {
            invalidBody.push("email")
        }

        if (req.body.password !== undefined && (typeof req.body.password !== "string" || req.body.password === "")) {
            invalidBody.push("password")
        }

        if (invalidBody.length > 0) {
            throw new ClientError(400, `Your ${invalidBody.join(", ")} cannot be empty!`)
        }

        const email: string = req.body.email;
        const password: string = req.body.password;

        const user = await this._user.user.findFirst({
            where: {
                email
            }
        })

        if (user === undefined || user === null) {
            throw new ClientError(404, "User not found!")
        }


        try {
            if (await this.comparePassword(password, user?.password)) {
                const token = sign({userId: email}, SECRET_KEY, {expiresIn: '2h'})

                res.status(200).json({
                    message: `User ${email} login success!!`,
                    token
                })
            } else {
                res.status(403).json({
                    message: "Password not match!"
                })
            }
            return;
        } catch(err: unknown) {
            throw new ServerError(500, `Something wrong`)
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword;
    }

    private async comparePassword(inputPassword: string, userPassword: string | undefined): Promise<boolean> {
        const input = inputPassword ?? "";
        const user = userPassword ?? "";
        return await bcrypt.compare(input, user);
    }
}

export default UserController;