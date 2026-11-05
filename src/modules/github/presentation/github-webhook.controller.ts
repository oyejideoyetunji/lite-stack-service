import type { Request, Response } from "express";
import { BadRequest, UnsupportedMediaType } from "../../../shared/error";
import type { CompleteGithubInstallationUseCase } from "../application";

interface GithubWebhookUseCases {
    completeInstallation: CompleteGithubInstallationUseCase;
}

export class GithubWebhookController {
    constructor (
        private readonly useCases: GithubWebhookUseCases,
    ){}

    execute = (req: Request, res: Response) => {
        const payload: unknown = req.body;

        if (!Buffer.isBuffer(payload)) {
          throw new UnsupportedMediaType("Expected a raw JSON request body");
        }

        const signature = req.get("x-hub-signature-256");
        const deliveryId = req.get("x-github-delivery");
        const eventName = req.get("x-github-event");

        if (!deliveryId || !eventName) {
            throw new BadRequest("Missing GitHub webhook headers");
        }

        this.useCases.completeInstallation.execute({ signature, payload });

        res.status(202).send({ received: true });
    };
}
