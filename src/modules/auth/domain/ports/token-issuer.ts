export type JwtPayload = {
  userId: string;
  email: string;
  roles: string[];
}

export interface TokenIssuer {
  issueFor(params: JwtPayload): string;
}
