import { Request, Response } from "express";
import SuccessResponse from "../responses/success";

export default class HomeController {
    static index(req: Request, res: Response) {
        return SuccessResponse(res, {});
    }
}