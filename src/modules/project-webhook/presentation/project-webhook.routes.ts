import { Router } from "express";
import type { ProjectWebhookController } from "./project-webhook.controller";

export function projectWebhookRoutes(controller: ProjectWebhookController) {
    const router: Router = Router();

    router.post("", controller.createGithubEvent);

    return router;
}
