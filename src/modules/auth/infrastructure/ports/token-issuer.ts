import { config } from "../../../../shared/config";
import type { TokenIssuer, JwtPayload } from "../../domain/ports";
import Jwt from "jsonwebtoken";

export class TokenIssuerPort implements TokenIssuer {
    issueFor = (params: JwtPayload) => {
        return makeJWT(params, 60*60, config.api.jwtSecrete)
    }
}

function makeJWT(params: Record<string, any>, expiresIn: number, secrete: string) {
    return Jwt.sign(params, secrete, { expiresIn });
}

