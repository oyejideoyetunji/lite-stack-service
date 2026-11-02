import type { Request, Response, NextFunction } from "express";
import { ClientError } from "../error";

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    console.log(error);

    if (error instanceof ClientError) {
        res.status(error.status).send({ "error": error.message });
        return;
    }

    res.status(500).send({ "error": "Something went wrong on our end" });
}

