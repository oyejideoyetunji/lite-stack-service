import type { InstallationStateRepository } from "../domain/repository";
import { getByteString, getHash } from "../../../shared/utils";


export class StartGithubInstallationUseCase {
    constructor (
        private readonly installationStates: InstallationStateRepository
    ) {}

    async execute(userId: string) {
        const startTag = getByteString();
        const stateHash = getHash(startTag);

        const state = await this.installationStates.start({
            userId,
            stateHash,
            expiresAt: new Date(Date.now() + 60*10*1000)
        });

        if (!state) {
            throw new Error(`Failed to start github installation for user: ${userId}`)
        }

        return startTag;
    }
}
