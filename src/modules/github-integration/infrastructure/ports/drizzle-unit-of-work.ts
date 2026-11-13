import { type Database } from "../../../../shared/db";
import type { TransactionRepositories, UnitOfWork } from "../../domain/ports";
import { DrizzleGithubInstallationRepository, DrizzleGithubRepositoryRepository, DrizzleInstallationStateRepository, DrizzleUserGithubInstallationRepository } from "../repository";

export class DrizzleUnitOfWork implements UnitOfWork {
    constructor(private readonly db: Database) {}

    run<T>(work: (repos: TransactionRepositories) => Promise<T>): Promise<T> {
        return this.db.transaction((tx) =>
            work({
                installations: new DrizzleGithubInstallationRepository(tx),
                repositories: new DrizzleGithubRepositoryRepository(tx),
                states: new DrizzleInstallationStateRepository(tx),
                userInstallations: new DrizzleUserGithubInstallationRepository(tx),
            })
        );
    }
}
