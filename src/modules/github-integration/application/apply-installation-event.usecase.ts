import type { UnitOfWork } from "../domain/ports";
import type { InstallationEventCommand } from "./dto/installation-event.command";

export class ApplyInstallationEventUseCase {
    constructor(
        private readonly unitOfWork: UnitOfWork
    ) {}

    async execute(cmd: InstallationEventCommand) {
        await this.unitOfWork.run(async ({ installations, repositories }) => {
            const installation = await installations.upsert(cmd.installation);
            if (cmd.action === "created") await repositories.upsertMany(cmd.repositories.map(r => ({...r, installationId: installation.id})));
            if (cmd.action === "deleted") {
                await installations.markDeleted(installation.id);
                await repositories.markRemoved(installation.id, cmd.repositories.map(r => r.githubRepoId))
            }
        });
    }
}
