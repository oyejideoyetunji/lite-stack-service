import type { GithubRepository, NewGithubRepositoryPayload } from "../../../../shared/types";

export interface GithubRepositoryRepository {
    upsertMany(repos: NewGithubRepositoryPayload[]): Promise<GithubRepository[]>;
    markRemoved(installationId: string, githubRepoIds?: number[]): Promise<void>; // no ids = all
}
