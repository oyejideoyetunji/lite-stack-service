import type { UserRepository } from "../domain";

export class GetUsersUseCase {
    constructor(private readonly users: UserRepository) {}

    execute = async () => {
        return await this.users.getAll();
    }
}
