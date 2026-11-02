import { CreateGithubEventUseCase } from "./application/create-github-event.usecase";
import { GithubSignatureManager } from "./infrastructure/ports/github-signature-manager";
import { ProjectWebhookController } from "./presentation/project-webhook.controller";
import { projectWebhookRoutes } from "./presentation/project-webhook.routes";

export function createProjectWebHookModule() {
    const projectWebhookUseCases = {
        createGithubEvent: new CreateGithubEventUseCase(new GithubSignatureManager())
    };

    const router = projectWebhookRoutes(new ProjectWebhookController(projectWebhookUseCases));

    return { router };
}
