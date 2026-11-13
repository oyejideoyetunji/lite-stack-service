import type { GithubInstallationRepository, GithubRepositoryRepository, InstallationStateRepository } from "../repository";
import type { UserGithubInstallationRepository } from "../repository";

export interface TransactionRepositories {
    installations: GithubInstallationRepository;
    repositories: GithubRepositoryRepository;
    states: InstallationStateRepository;
    userInstallations: UserGithubInstallationRepository;
}
export interface UnitOfWork {
    run<T>(work: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
