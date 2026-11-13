import { Router } from "express";
import type { GithubWebhookController } from "./github-webhook.controller";
import type { SignatureManager } from "../domain/ports";
import { verifyGithubWebhook } from "./github-webhook.middleware";

export function githubWebhookRoutes(controller: GithubWebhookController, signatureManager: SignatureManager) {
    const router: Router = Router();

    router.post("", verifyGithubWebhook(signatureManager), controller.execute);

    return router;
}
