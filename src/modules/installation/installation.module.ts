import { CreateGithubInstallationUseCase } from "./application";
import { GithubSignatureManager } from "./infrastructure/ports";
import { GithubInstallationController } from "./presentation/github/github-installation.controller";
import { installationRoutes } from "./presentation/installation.routes";

export function createInstallationModule() {
    const githubInstallationUseCases = {
        createGithubInstallation: new CreateGithubInstallationUseCase(new GithubSignatureManager())
    };

    const router = installationRoutes({
        githubInstallationController: new GithubInstallationController(githubInstallationUseCases)
    });

    return { router };
}
