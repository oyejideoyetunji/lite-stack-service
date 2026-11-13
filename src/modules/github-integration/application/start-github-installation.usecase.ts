import type { InstallationStateRepository } from "../domain/repository";
import type { StateTokenManager } from "../domain/ports";


export class StartGithubInstallationUseCase {
    constructor (
        private readonly installationStates: InstallationStateRepository,
        private readonly tokenManager: StateTokenManager
    ) {}

    async execute(userId: string) {
        const { token, hash } = this.tokenManager.generate();

        const state = await this.installationStates.create({
            userId,
            stateHash: hash,
            expiresAt: new Date(Date.now() + 60*30*1000)
        });

        if (!state) {
            throw new Error(`Failed to start github installation for user: ${userId}`)
        }

        return token;
    }
}
