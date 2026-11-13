import { and, eq, gt, isNull } from "drizzle-orm";
import { installationStates, type DbExecutor } from "../../../../shared/db";
import type { NewInstallationState } from "../../../../shared/types";
import type { InstallationStateRepository } from "../../domain/repository";

export class DrizzleInstallationStateRepository implements InstallationStateRepository {
    constructor(private readonly db: DbExecutor) {}

    async create(payload: NewInstallationState) {
        const [ result ] = await this.db
            .insert(installationStates)
            .values(payload)
            .returning();

        return result
    }

    async consume(hash: string, userId: string) {
        const [ result ] = await this.db
            .update(installationStates)
            .set({ consumedAt: new Date() })
            .where(and(
                eq(installationStates.stateHash, hash),
                eq(installationStates.userId, userId),
                isNull(installationStates.consumedAt),
                gt(installationStates.expiresAt, new Date()),
            )).returning();

        return result;
    }
}
