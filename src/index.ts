import "reflect-metadata";
import { connect } from "mongoose";
import express from "express";
import corsMiddleware from "cors";
import routes from "./routes";
import config from "./config";
import Logger from "./common/logger";

process.on("SIGINT", () => process.exit());

(async function () {
    try {
        // Connnect to db
        await connect(config.db.uri, {
            dbName: config.db.name,
            poolSize: 200,
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
        app.listen(config.app.port, () => {
            Logger.info(`App running on :${config.app.port}`);
        });
    } catch (e) {
        Logger.error((e as Error).stack);
    }
})();
