import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import z from "zod";
import { Unauthorized } from "../error";
import { config } from "../config";
import type { UserGateWay } from "../types";

const schema = z.object({
    userId: z.string(),
    email: z.email(),
    roles: z.array(z.string())
})

type GateWay = Pick<UserGateWay, "getUserAuth">

export function setAuthData(gateway: GateWay){
    return async function (req: Request, res: Response, next: NextFunction){
        try {
            const token = getBearerToken(req);
            const payload = validateJWT(token, config.api.jwtSecrete);
            const parsed = schema.parse(payload);
            await gateway.getUserAuth(parsed.email);

            req["auth"] = parsed; 

            next();
        } catch (error) {
            console.log(error);
            throw new Unauthorized();
        }
    }
}

function validateJWT(tokenString: string, secret: string) {
    return Jwt.verify(tokenString, secret);
}


function getBearerToken(req: Pick<Request, "headers">) {
    const {name, token} = extractAuthToken(req);

    if (name.toLowerCase() !== "bearer" || !token) {
        throw new Unauthorized();
    }

    return token;
}

function extractAuthToken(req: Pick<Request, "headers">) {
    if (typeof req.headers.authorization !== "string") {
        throw new Unauthorized();
    }

    const auth = req.headers.authorization.split(" ");

    if (auth.length !== 2 || !auth[0] || !auth[1]) {
        throw new Unauthorized();
    }

    return { name: auth[0], token: auth[1] };
}
