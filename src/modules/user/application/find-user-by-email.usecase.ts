import { NotFound } from "../../../shared/error";
import type { UserRepository } from "../domain";

export class FindUserByEmailUseCase {
    constructor(private readonly users: UserRepository) {}

    execute = async (email: string) => {
        const user = await this.users.findByEmail(email);

        if (!user) {
            throw new NotFound("user not found");
        }

        return user;
    }
}
