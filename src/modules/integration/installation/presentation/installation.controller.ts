import type { Request, Response } from "express";
import type { CreateGithubInstallationUseCase } from "../application";
import { BadRequest, UnsupportedMediaType } from "../../../../shared/error";

interface InstallationUsecases {
    createGithubInstallation: CreateGithubInstallationUseCase;
}

export class InstallationController {
    constructor (
        private readonly useCases: InstallationUsecases,
    ){}

    createGithubInstallation = (req: Request, res: Response) => {
        const payload: unknown = req.body;
        console.log("payload", payload)

        if (!Buffer.isBuffer(payload)) {
          throw new UnsupportedMediaType("Expected a raw JSON request body");
        }

        const signature = req.get("x-hub-signature-256");
        console.log("signature", signature);
        const deliveryId = req.get("x-github-delivery");
        console.log("deliveryId", deliveryId)
        const eventName = req.get("x-github-event");
        console.log("eventName", eventName)

        if (!deliveryId || !eventName) {
            throw new BadRequest("Missing GitHub webhook headers");
        }

        const event = this.useCases.createGithubInstallation.execute({ signature, payload });
        console.log(event)

        res.status(202).send({ received: true });
    }
}
