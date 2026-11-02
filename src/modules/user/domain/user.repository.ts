import type { NewUserPayload, User, UserResponse } from "../../../shared/types";

export interface UserRepository {
    save(user: NewUserPayload): Promise<UserResponse | undefined>;
    getAll(): Promise<UserResponse[]>;
    findById(id: string): Promise<UserResponse | undefined>;
    findByEmail(email: string): Promise<UserResponse | undefined>;
    getUserAuth(email: string): Promise<User | undefined>;
    update(id: string, newData: Partial<User>): Promise<UserResponse | undefined>;
}
