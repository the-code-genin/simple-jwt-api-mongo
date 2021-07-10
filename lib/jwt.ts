import jwt from 'jsonwebtoken'
import { User } from '../models/user';

export interface JWTData {
    iss: string,
    sub: string
};

export default class JWT {
    /**
     * Extract user id from a valid access token.
     */
    static verifyAccessToken(token: string): string | null {
        try {
            let payload = jwt.verify(token, String(process.env.APP_KEY)) as JWTData;
            return payload.sub;
        } catch (e) {
            return null;
        }
    }

    /**
     * Generate access token from a user instance
     */
    static generateAccessToken(user: User): string {
        let data: JWTData = {
            iss: String(process.env.APP_URL),
            sub: user._id
        };

        return jwt.sign(data, String(process.env.APP_KEY));
    }
}