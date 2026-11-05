import { CompleteGithubInstallationUseCase, StartGithubInstallationUseCase } from "./application";
import { GithubSignatureManager } from "./infrastructure/ports";
import { GithubInstallationStateRepository } from "./infrastructure/repository";
import { GithubWebhookController } from "./presentation/github-webhook.controller";
import { GithubController } from "./presentation/github.controller";
import { githubRoutes, githubWebhookRoutes } from "./presentation/github.routes";

export function createGithubModule() {
    const githubUseCases = {
        startInstallation: new StartGithubInstallationUseCase(new GithubInstallationStateRepository()),
    };

    const githubWebhookUseCases = {
        completeInstallation: new CompleteGithubInstallationUseCase(new GithubSignatureManager()),
    };

    const githubRouter = githubRoutes(new GithubController(githubUseCases));
    const githubWebhookRouter = githubWebhookRoutes(new GithubWebhookController(githubWebhookUseCases));

    return { githubRouter, githubWebhookRouter };
}
