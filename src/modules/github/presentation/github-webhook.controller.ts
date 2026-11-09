import type { Request, Response } from "express";
import { BadRequest, UnsupportedMediaType } from "../../../shared/error";
import type { HandleWebhookUseCase } from "../application";

interface GithubWebhookUseCases {
    handleWebhook: HandleWebhookUseCase;
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
        const event = req.get("x-github-event");

        if (!deliveryId || !event) {
            throw new BadRequest("Missing GitHub webhook headers");
        }

        const data = this.useCases.handleWebhook.execute({ signature, payload, event });
        console.log(">=========== webhook Data Starts ============<");
        console.log("data: ", data)
        console.log("signature: ", signature)
        console.log("deliveryId: ", deliveryId)
        console.log("eventName: ", event)
        console.log(">=========== webhook Data Ends ============<");

        res.status(202).send({ received: true });
    };
}
