import { CompleteGithubInstallationUseCase, HandleWebhookUseCase, StartGithubInstallationUseCase } from "./application";
import { GithubSignatureManager } from "./infrastructure/ports";
import { GithubInstallationStateRepository } from "./infrastructure/repository";
import { GithubWebhookController } from "./presentation/github-webhook.controller";
import { GithubController } from "./presentation/github.controller";
import { githubRoutes, githubWebhookRoutes } from "./presentation/github.routes";

export function createGithubModule() {
    const githubUseCases = {
        startInstallation: new StartGithubInstallationUseCase(new GithubInstallationStateRepository()),
        completeInstallation: new CompleteGithubInstallationUseCase(new GithubInstallationStateRepository()),
    };

    const githubWebhookUseCases = {
        handleWebhook: new HandleWebhookUseCase(new GithubSignatureManager()),
    };

    const githubRouter = githubRoutes(new GithubController(githubUseCases));
    const githubWebhookRouter = githubWebhookRoutes(new GithubWebhookController(githubWebhookUseCases));

    return { githubRouter, githubWebhookRouter };
}
