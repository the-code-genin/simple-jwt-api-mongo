import dotenv from "dotenv";
import "reflect-metadata";
import { connect } from "mongoose";
import express from "express";
import corsMiddleware from "cors";
import routes from "./routes";
import config from "./config";
import {resolve as resolvePath} from "path";
import Logger from "./logger";

process.on("SIGINT", () => process.exit());

(async function () {
    dotenv.config({ path: resolvePath(__dirname, "../.env") });
    const conf = config();
    Logger.debug("Configured env variables");

    // Connnect to db
    await connect(conf.db.uri, {
        dbName: conf.db.name,
        poolSize: 200,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    Logger.debug("Connected to DB");

    // Create and configure express router
    const app = express();
    app.use(corsMiddleware());
    app.use(express.json());
    Logger.debug("Configured router");

    // Register all app routes.
    routes(app);
    Logger.debug("Registered app routes");

    // Start server.
    app.listen(conf.app.port, () => {
        Logger.info(`App running on :${conf.app.port}`);
    });
})();
