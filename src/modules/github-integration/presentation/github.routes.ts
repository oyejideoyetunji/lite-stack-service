import { Router } from "express";
import type { GithubController } from "./github.controller";
import { z } from "zod";
import { validateRequestData } from "../../../shared/middlewares";

export function githubRoutes(controller: GithubController) {
    const router: Router = Router();

    router.post("/installations/start", controller.startInstallation);
    router.post("/installations/complete", validateRequestData(completeInstallationSchema), controller.completeInstallation)

    return router;
}

const completeInstallationSchema = z.object({
    body: z.object({
        code: z.string(),
        state: z.hash("sha256"),
        installationId: z.string()
    })
});
