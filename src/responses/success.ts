import { Response } from "express";

export default function SuccessResponse<T>(res: Response, payload: T, status = 200) {
    return res.status(status).json({
        success: true,
        payload: payload
    });
}