import { NextFunction, Request, Response } from "express";
import Users from "../database/repositories/users";
import { ConflictError, BadRequestError } from "../responses";
import Joi from "joi";

export default class AuthValidator {
    static async login(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string().required().email().message("Invalid email supplied"),

            password: Joi.string()
                .required()
                .min(6)
                .message("Password is required and must be at least 6 characters long"),
        });
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            return BadRequestError(res, String(validationResult.error));
        }

        next();
    }

    static async signup(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            email: Joi.string().required().email().message("Invalid email supplied"),

            password: Joi.string()
                .required()
                .min(6)
                .message("Password is required and must be at least 6 characters long"),
        });
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            return BadRequestError(res, String(validationResult.error));
        } else if (await Users.emailTaken(req.body.email)) {
            return ConflictError(res, "This email is not available.");
        }

        next();
    }
}
