import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../database/models/user";

export default class JWT {
    static verifyAccessToken(token: string): string | null {
        try {
            const payload = jwt.verify(token, String(process.env.APP_KEY)) as JwtPayload;
            return payload.sub != null ? payload.sub : null;
        } catch (e) {
            return null;
        }
    }

    static generateAccessToken(user: User): string {
        const data: JwtPayload = {
            iss: String(process.env.APP_URL),
            sub: user._id
        };

        return jwt.sign(data, String(process.env.APP_KEY));
    }
}