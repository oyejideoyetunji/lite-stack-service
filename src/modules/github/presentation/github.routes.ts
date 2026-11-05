import { Router } from "express";
import type { GithubController } from "./github.controller";
import type { GithubWebhookController } from "./github-webhook.controller";

export function githubRoutes(controller: GithubController) {
    const router: Router = Router();

    router.post("/installation/start", controller.startInstallation);

    return router;
}

export function githubWebhookRoutes(controller: GithubWebhookController) {
    const router: Router = Router();

    router.post("/webhook", controller.execute);

    return router;
}
