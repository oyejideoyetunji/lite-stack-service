import { db, installationStates } from "../../../../shared/db";
import type { NewInstallationState } from "../../../../shared/types";
import type { InstallationStateRepository } from "../../domain/repository";

export class GithubInstallationStateRepository implements InstallationStateRepository {
    async start(payload: NewInstallationState) {
        const [ result ] = await db
            .insert(installationStates)
            .values(payload)
            .returning();

        return result
    }
}
