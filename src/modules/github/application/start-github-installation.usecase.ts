import { createHash, randomBytes } from "node:crypto";
import type { InstallationStateRepository } from "../domain/repository";


export class StartGithubInstallationUseCase {
    constructor (
        private readonly states: InstallationStateRepository
    ) {}

    async execute(userId: string) {
        const startTag = randomBytes(32).toString("hex");
        const stateHash = createHash("sha256").update(startTag).digest("hex");

        const state = await this.states.start({
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
