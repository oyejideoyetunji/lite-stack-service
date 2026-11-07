import { and, eq, gt, isNull } from "drizzle-orm";
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

    async get(hash: string, userId: string) {
        const [ result ] = await db
            .select()
            .from(installationStates)
            .where(and(
                eq(installationStates.stateHash, hash),
                eq(installationStates.userId, userId),
                isNull(installationStates.consumedAt),
                gt(installationStates.expiresAt, new Date()),
            )).limit(1);

        return result;
    }
}
