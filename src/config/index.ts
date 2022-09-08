import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../.env") });

export default {
    app: {
        env: String(process.env.NODE_ENV),
        port: Number(process.env.PORT) || 8080,
        key: String(process.env.APP_KEY)
    },
    db: {
        uri: String(process.env.DB_URI),
        name: String(process.env.DB_NAME)
    }
};