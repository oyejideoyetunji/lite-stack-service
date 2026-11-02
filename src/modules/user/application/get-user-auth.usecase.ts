import { Unauthorized } from "../../../shared/error";
import type { UserRepository } from "../domain";

export class GetUserAuthUseCase {
    constructor(private readonly users: UserRepository) {}

    execute = async (email: string) => {
        const user = await this.users.getUserAuth(email);

        if (!user) {
            throw new Unauthorized();
        }

        return user;
    }
}
