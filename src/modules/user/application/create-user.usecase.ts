import { BadRequest } from "../../../shared/error";
import type { NewUserPayload } from "../../../shared/types";
import type { UserRepository } from "../domain";

export class CreateUserUseCase {
    constructor(private readonly users: UserRepository) {}

    execute = async (data: NewUserPayload) => {
        if (await this.users.findByEmail(data.email)) {
            throw new BadRequest("Email already in use")
        }

        const user = await this.users.save(data);

        if (!user) {
            throw new Error(`Failed to create user for the given email: ${data.email}`);
        }

        return user;
    }
}
