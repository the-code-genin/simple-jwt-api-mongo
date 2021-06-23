import { Request, Response } from "express";

export default class HomeController {
    static index(req: Request, res: Response) {
        res.status(200).render('index');
    }
}