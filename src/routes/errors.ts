import { Application, NextFunction, Request, Response } from "express";
import { NotFoundError, ServerError } from "../responses";
import Logger from "../logger";

export default (app: Application) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        Logger.http(`Route not found: ${req.path}`);
        return NotFoundError(res);
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        Logger.error(err.stack);
        return ServerError(res);
    });
};
