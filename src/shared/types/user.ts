import type { users } from "../db";

export type User = typeof users.$inferSelect;
export type NewUserPayload = typeof users.$inferInsert;
export type UserResponse = Omit<User, "hashedPassword">;

export interface UserGateWay {
    createUser: (payload: NewUserPayload) => Promise<UserResponse>;
    getUserAuth: (email: string) => Promise<User>;
}
