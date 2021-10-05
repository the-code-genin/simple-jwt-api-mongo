import jwt from '../lib/jwt'
import { AuthenticationError } from '../lib/errors'
import UserModel, { User } from '../models/user'
import { NextFunction, Request, Response } from 'express';

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let header = String(req.get('Authorization'));
    if (!/^Bearer (.+)$/i.test(header)) { // Bearer token is not present
        res.status(401).json(AuthenticationError('User is not Authenticated'));
        return;
    }

    // Extract user ID from bearer token
    let token = (/^Bearer (.+)$/i.exec(header) as string[])[1].trim();
    let id = jwt.verifyAccessToken(token);
    if (!id) { // Invalid Bearer token
        res.status(401).json(AuthenticationError('User is not Authenticated'));
        return;
    }

    // Get the user record
    let user: User | undefined;
    try {
        user = await UserModel.findOne({ _id: id }).exec();

        if (user == null) throw new Error('User is not Authenticated');
        else if (await user.hasToken(token)) throw new Error('User is not Authenticated');
        else if (user.status != 'active') throw new Error('User is banned from using the platform');
    } catch (e) {
        res.status(401).json(AuthenticationError((e as Error).message));
        return;
    }

    req.app.set('authUser', user);
    next();
}