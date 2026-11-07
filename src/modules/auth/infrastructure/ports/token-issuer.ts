import Jwt from "jsonwebtoken";
import { config } from "../../../../shared/config";
import type { AuthContext } from "../../domain/auth-context";
import type { TokenIssuer } from "../../domain/ports";

export class TokenIssuerPort implements TokenIssuer {
    issueFor = (params: AuthContext) => {
        return makeJWT(params, 60*60, config.api.jwtSecret)
    }
}

function makeJWT(params: Record<string, any>, expiresIn: number, secrete: string) {
    return Jwt.sign(params, secrete, { expiresIn });
}

