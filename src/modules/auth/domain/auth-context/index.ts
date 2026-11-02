import type { JwtPayload } from "../ports";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export { };
