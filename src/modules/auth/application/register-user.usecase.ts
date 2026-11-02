import type { UserGateWay } from "../domain/gate-ways";
import type { PasswordHasher } from "../domain/ports";

type RegisterUserPayload = {
    email: string;
    username: string;
    password: string;
}

export class RegisterUserUseCase {
    constructor (
        private readonly users: UserGateWay,
        private readonly passwordHasher: PasswordHasher
    ) {}

    execute = async (data: RegisterUserPayload) => {
        const hashedPassword = await this.passwordHasher.hash(data.password);

        return await this.users.createUser({ email: data.email, username: data.username, hashedPassword });
    }
}
