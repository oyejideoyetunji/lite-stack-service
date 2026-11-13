import type { NewGithubRepositoryPayload } from "../../../../shared/types";

export type MappedGithubRepositoryPayload = Omit<NewGithubRepositoryPayload, "installationId">;
