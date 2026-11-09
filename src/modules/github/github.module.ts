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

    const githubRouter = githubRoutes(new GithubController(githubUseCases));

    return { githubRouter };
}

export function createGithubWebhookModule() {
    const githubWebhookUseCases = {
        handleWebhook: new HandleWebhookUseCase(new GithubSignatureManager()),
    };

    const githubWebhookRouter = githubWebhookRoutes(new GithubWebhookController(githubWebhookUseCases));

    return { githubWebhookRouter };
}
