import { z, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateRequestData(schema: z.ZodObject) {
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
                res.status(400).send({ errors: error.issues })
                return;
            }
            next(error)
        }
    }
}
