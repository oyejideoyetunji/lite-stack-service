import type { MappedGithubInstallationPayload, MappedGithubRepositoryPayload } from "../../domain/entity";

// application/dto/installation-event.command.ts
export type InstallationEventCommand = {
    type: "installation";
    action: "created" | "deleted" | "suspend" | "unsuspend" | "new_permissions_accepted";
    installation: MappedGithubInstallationPayload; // domain type, camelCase
    repositories: MappedGithubRepositoryPayload[]; // only populated on "created"
};
