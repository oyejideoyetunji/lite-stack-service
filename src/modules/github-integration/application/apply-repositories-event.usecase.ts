import type { UnitOfWork } from "../domain/ports";
import type { RepositoriesEventCommand } from "./dto/repositories-event.command";

export class ApplyRepositoryEventUseCase {
    constructor(
        private readonly unitOfWork: UnitOfWork
    ) {}

    async execute(cmd: RepositoriesEventCommand) {
        await this.unitOfWork.run(async ({ installations, repositories }) => {
            const installation = await installations.upsert(cmd.installation);
            if (cmd.action === "added") await repositories.upsertMany(cmd.repositoriesAdded.map(r => ({...r, installationId: installation.id})));
            if (cmd.action === "removed") {
                await repositories.markRemoved(installation.id, cmd.repositoriesRemoved.map(r => r.githubRepoId))
            }
        });
    }
}
