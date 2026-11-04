import { CreateGithubInstallationUseCase } from "./application";
import { GithubSignatureManager } from "./infrastructure/ports";
import { InstallationController } from "./presentation/installation.controller";
import { installationRoutes } from "./presentation/installation.routes";

export function createInstallationModule() {
    const installationUseCases = {
        createGithubInstallation: new CreateGithubInstallationUseCase(new GithubSignatureManager())
    };

    const router = installationRoutes(new InstallationController(installationUseCases));

    return { router };
}
