import { eq } from "drizzle-orm";
import { db, users } from "../../../shared/db";
import type { NewUserPayload, User} from "../../../shared/types";
import type { UserRepository } from "../domain";

const userResponse = { id: users.id, createdAt: users.createdAt, updatedAt: users.updatedAt, username: users.username, email: users.email, role: users.role };

export class OrmUserRepository implements UserRepository {
    async save(user: NewUserPayload) {
        const [ result ] = await db
            .insert(users)
            .values(user)
            .returning(userResponse);

        return result;
    }

    async getAll() {
        const results = await db
            .select(userResponse)
            .from(users);

        return results;
    }

    async findById(id: string) {
        const [ result ] = await db
            .select(userResponse)
            .from(users)
            .where(eq(users.id, id));
        
        return result;
    }

    async findByEmail(email: string) {
        const [ result ] = await db
            .select(userResponse)
            .from(users)
            .where(eq(users.email, email));
        
        return result;
    }

    async getUserAuth(email: string) {
        const [ result ] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
        
        return result;
    }

    async update(id: string, newData: Partial<User>) {
        const [ result ] = await db
            .update(users)
            .set(newData)
            .where(eq(users.id, id))
            .returning(userResponse)

        return result;
    }
}
