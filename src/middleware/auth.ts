import jwt from "../common/jwt";
import { BadRequestError } from "../responses";
import { NextFunction, Request, Response } from "express";
import Users from "../database/repositories/users";
import { User } from "../database/models/user";

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.get("Authorization") as string;
    if (!/^Bearer (.+)$/i.test(header)) {
        return BadRequestError(res, "Bad token.");
    }

    const token = (/^Bearer (.+)$/i.exec(header) as string[])[1].trim();
    const id = jwt.verifyAccessToken(token);
    if (!id) {
        return BadRequestError(res, "Bad/Expired token.");
    }

    let user: User | null;
    try {
        user = await Users.getUserByID(id);
        if (user == null) {
            throw new Error("User is not found.");
        } else if (await Users.checkUserHasAuthToken(user.id, token)) {
            throw new Error("Expired auth token.");
        }
    } catch (e) {
        return BadRequestError(res, (e as Error).message);
    }

    req.app.set("authUser", user);
    next();
}
