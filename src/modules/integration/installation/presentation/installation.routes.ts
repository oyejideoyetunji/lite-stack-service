import { Router } from "express";
import type { InstallationController } from "./installation.controller";

export function installationRoutes(controller: InstallationController) {
    const router: Router = Router();

    router.post("/github", controller.createGithubInstallation);

    return router;
}
