import jwt from '../helpers/jwt'
import { AuthenticationError } from '../responses/errors'
import { NextFunction, Request, Response } from 'express';
import Users from '../database/repositories/users';
import { User } from '../database/models/user';

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let header = req.get('Authorization') as string;
    if (!/^Bearer (.+)$/i.test(header)) {
        return AuthenticationError(res, "Bad token.");
    }

    let token = (/^Bearer (.+)$/i.exec(header) as string[])[1].trim();
    let id = jwt.verifyAccessToken(token);
    if (!id) {
        return AuthenticationError(res, "Bad/Expired token.");
    }

    let user: User | null;
    try {
        user = await Users.getUserByID(id);
        if (user == null) {
            throw new Error('User is not Authenticated.');
        } else if (await Users.checkUserHasAuthToken(user.id, token)) {
            throw new Error('Expired auth token.');
        }
    } catch (e) {
        return AuthenticationError(res, (e as Error).message);
    }

    req.app.set('authUser', user);
    next();
}