import type { RequestHandler } from "express";
import type { SignatureManager } from "../domain/ports";
import { BadRequest, Unauthorized } from "../../../shared/error";

// presentation/github-webhook.middleware.ts
export function verifyGithubWebhook(signatures: SignatureManager): RequestHandler {
    return (req, res, next) => {
        const signature = req.get("x-hub-signature-256");
        const event = req.get("x-github-event");
        const deliveryId = req.get("x-github-delivery");

        if (!signature || !event || !deliveryId) {
            throw new BadRequest("Missing GitHub webhook headers");
        }
        if (!Buffer.isBuffer(req.body)) {
            throw new Error("Webhook route is missing raw body parser");
        }
        if (!signatures.verify(signature, req.body)) {
            throw new Unauthorized("Invalid signature");
        }

        res.locals.github = { event, deliveryId }; // typed context for the controller
        next();
    };
}
