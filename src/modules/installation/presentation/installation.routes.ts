import { Router } from "express";
import type { GithubInstallationController } from "./github/github-installation.controller";
import { githubInstallationRoutes } from "./github/github-installation.routes";

interface InstallationController {
    githubInstallationController: GithubInstallationController
}

export function installationRoutes({
    githubInstallationController
}: InstallationController) {
    const router: Router = Router();

    router.use("/github", githubInstallationRoutes(githubInstallationController));

    return router;
}
