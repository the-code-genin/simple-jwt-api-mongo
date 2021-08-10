import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { AuthenticationError, ServerError } from "../lib/errors";
import JWT from "../lib/jwt";
import UserModel, { User } from "../models/user";
import AuthToken from "../models/auth-token";

export default class AuthController {
    /**
     * Generate JWT token for a user upon successful credential validation
     */
    static async login(req: Request, res: Response) {
        let user: User | undefined;

        try {
            user = await UserModel.findOne({ email: req.body.email }).exec();

            if (user == null) {
                throw new Error("Email and password combination do not match a user in our system.");
            } else if (!await bcrypt.compare(req.body.password, String(user.password))) {
                throw new Error("Email and password combination do not match a user in our system.");
            }
        } catch (e) {
            res.status(401).json(AuthenticationError((e as Error).message));
            return;
        }

        res.status(200).json({
            success: true,
            payload: {
                data: user.toJSON(),
                access_token: JWT.generateAccessToken(user),
                token_type: 'bearer'
            }
        });
    }

    /**
     * Sign a user up and generate the initial JWT auth token
     */
    static async signup(req: Request, res: Response) {
        let user: User | undefined;

        try {
            user = (new UserModel) as User;
            user.email = req.body.email;
            user.password = await bcrypt.hash(req.body.password, 10);
            user = await user.save();
        } catch (e) {
            res.status(500).json(ServerError((e as Error).message));
            return;
        }

        res.status(201).json({
            success: true,
            payload: {
                data: user.toJSON(),
                access_token: JWT.generateAccessToken(user),
                token_type: 'bearer'
            }
        });
    }

    /**
     * Invalidate a user's auth token
     */
    static async logout(req: Request, res: Response) {
        try {
            let matches = /^Bearer (.+)$/i.exec(String(req.get('Authorization'))) as RegExpExecArray;
            let token = matches[1].trim();


            // Add token to list of invalidated tokens.
            let user = req.app.get('authUser') as User;
            await AuthToken.create({
                token,
                user_id: user._id
            });
        } catch (e) {
            res.status(500).json(ServerError((e as Error).message));
            return;
        }

        res.status(200).json({
            success: true,
            payload: {}
        });
    }

    /**
     * Request a user object
     */
    static async getMe(req: Request, res: Response) {
        res.status(200).json({
            success: true,
            payload: {
                data: (req.app.get('authUser') as User).toJSON()
            }
        });
    }
}