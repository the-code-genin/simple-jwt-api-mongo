import dotenv from "dotenv";
import "reflect-metadata";
import { connect } from "mongoose";
import express from "express";
import corsMiddleware from "cors";
import routes from "./routes";
import config from "./config";
import {resolve as resolvePath} from "path";

process.on("SIGINT", () => process.exit());

(async function () {
    dotenv.config({ path: resolvePath(__dirname, "../.env") });
    const conf = config();

    // Connnect to db
    await connect(conf.db.uri, {
        dbName: conf.db.name,
        poolSize: 200,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Create and configure express router
    const app = express();
    app.use(corsMiddleware());
    app.use(express.json());

    // Register all app routes.
    routes(app);

    // Start server.
    app.listen(conf.app.port, () => {
        console.log(`App running on :${conf.app.port}`);
    });
})();
