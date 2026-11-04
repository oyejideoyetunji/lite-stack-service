import { Router } from "express";
import type { GithubInstallationController } from "./github-installation.controller";

export function githubInstallationRoutes(controller: GithubInstallationController) {
    const router: Router = Router();

    router.post("", controller.create);

    return router;
}
