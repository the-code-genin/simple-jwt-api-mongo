import { Request, Response } from "express";
import { SuccessResponse } from "../responses";

export default class HomeController {
    static index(req: Request, res: Response) {
        return SuccessResponse(res, {});
    }
}