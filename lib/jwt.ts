import jwt from 'jsonwebtoken'
import {User} from '../models/user';

export interface JWTData {
    iss: string,
    exp: number,
    sub: string
};

export default class JWT {
    /**
     * Extract user id from a valid access token.
     */
    static verifyAccessToken(token: string): string|null {
        try {
            let payload = jwt.verify(token, String(process.env.APP_KEY)) as JWTData;
            return payload.sub;
        } catch(e) {
            return null;
        }
    }

    /**
     * Extract user id from a valid or expired access token.
     */
    static verifyExpiredAccessToken(token: string): string|null {
        try {
            let payload = jwt.verify(token, String(process.env.APP_KEY)) as JWTData;
            return payload.sub;
        } catch(e) {
            if (e instanceof jwt.TokenExpiredError) {
                let payload = jwt.decode(token) as JWTData;
                return payload.sub;
            } else return null;
        }
    }

    /**
     * Generate access token from a user instance
     */
    static generateAccessToken(user: User): string {
        let data: JWTData = {
            iss: String(process.env.APP_URL),
            exp: (new Date).getTime() + Number(process.env.JWT_TTI),
            sub: user._id
        };

        return jwt.sign(data, String(process.env.APP_KEY));
    }
}