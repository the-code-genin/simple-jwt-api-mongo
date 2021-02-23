import jwt from '../lib/jwt'
import {AuthenticationError} from '../lib/errors'
import UserModel from '../models/user'
import { NextFunction, Request, Response } from 'express';

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let header = req.get('Authorization') as string;
    if (!/^Bearer (.+)$/i.test(header)) { // Bearer token is not present
        res.json(AuthenticationError('User is not Authenticated'));
        return;
    }


    // Extract user ID from bearer token
    let token = (/^Bearer (.+)$/i.exec(header) as string[])[1].trim();
    let id = jwt.verifyAccessToken(token);
    if (!id) { // Invalid Bearer token
        res.json(AuthenticationError('User is not Authenticated'));
        return;
    }


    try {
        let user = await UserModel.findOne({id}).projection({userAuthTokens: -1}).exec();

        if (user == null) throw new Error('User is not Authenticated');
        else if (await user.hasToken(token) != 0) throw new Error('User is not Authenticated');

        req.app.set('authUser', user);
        next();
    } catch(e) {
        res.json(AuthenticationError(e.message));
    }
}