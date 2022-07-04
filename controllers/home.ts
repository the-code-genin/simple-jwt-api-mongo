import { Request, Response } from "express";
import SuccessResponse from "../lib/responses/success-response";

export default class HomeController {
    static index(req: Request, res: Response) {
        return SuccessResponse(res, {});
    }
}