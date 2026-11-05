import type { AuthContext } from "../auth-context";

export interface TokenIssuer {
  issueFor(params: AuthContext): string;
}
