import type { Request, Response, NextFunction } from "express";


export function nonOkResponseLogger(req: Request, resp: Response, next: NextFunction) {
    resp.on("finish", () => {
        if (resp.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${resp.statusCode}`);
        }
    });

    next();
}
