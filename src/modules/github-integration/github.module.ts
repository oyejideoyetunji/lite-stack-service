import { db } from "../../shared/db";
import { ApplyInstallationEventUseCase, ApplyRepositoryEventUseCase, CompleteGithubInstallationUseCase, StartGithubInstallationUseCase } from "./application";
import { GithubAppApiClient } from "./infrastructure/clients";
import { CryptoStateTokenManager, GithubSignatureManager } from "./infrastructure/ports";
import { DrizzleUnitOfWork } from "./infrastructure/ports/drizzle-unit-of-work";
import { DrizzleGithubRepositoryRepository, DrizzleInstallationStateRepository } from "./infrastructure/repository";
import { GithubWebhookController } from "./presentation/github-webhook.controller";
import { githubWebhookRoutes } from "./presentation/github-webhook.routes";
import { GithubController } from "./presentation/github.controller";
import { githubRoutes } from "./presentation/github.routes";

export function createGithubModule() {
    const githubUseCases = {
        startInstallation: new StartGithubInstallationUseCase(new DrizzleInstallationStateRepository(db), new CryptoStateTokenManager()),
        completeInstallation: new CompleteGithubInstallationUseCase(
            new GithubAppApiClient(),
            new CryptoStateTokenManager(),
            new DrizzleUnitOfWork(db),
            new DrizzleGithubRepositoryRepository(db)
        ),
    };

    const githubRouter = githubRoutes(new GithubController(githubUseCases));

    return { githubRouter };
}

export function createGithubWebhookModule() {
    const githubWebhookUseCases = {
        applyInstallationEvent: new ApplyInstallationEventUseCase(new DrizzleUnitOfWork(db)),
        applyRepositoriesEvent: new ApplyRepositoryEventUseCase(new DrizzleUnitOfWork(db))
    };

    const githubWebhookRouter = githubWebhookRoutes(new GithubWebhookController(githubWebhookUseCases), new GithubSignatureManager());

    return { githubWebhookRouter };
}
