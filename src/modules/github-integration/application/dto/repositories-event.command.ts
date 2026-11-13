import type { MappedGithubInstallationPayload, MappedGithubRepositoryPayload } from "../../domain/entity";

// application/dto/repositories-event.command.ts
export type RepositoriesEventCommand = {
    type: "installation_repositories";
    action: "added" | "removed";
    installation: MappedGithubInstallationPayload;
    repositoriesAdded: MappedGithubRepositoryPayload[];
    repositoriesRemoved: MappedGithubRepositoryPayload[];
};
