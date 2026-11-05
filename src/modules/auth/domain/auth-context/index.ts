export type AuthContext = {
  userId: string;
  email: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export { };
