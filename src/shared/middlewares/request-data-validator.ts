import { z, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequest, type ClientError } from "../error";

export function validateRequestData(
    schema: z.ZodObject,
    ErrorClass: new (message?: string) => ClientError = BadRequest
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            req.body = parsed.body;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ErrorClass(error.issues.join(", "));
            }
            next(error)
        }
    }
}
