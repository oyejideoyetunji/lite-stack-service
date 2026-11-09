import type { Request, Response } from "express";
import { BadRequest, UnsupportedMediaType } from "../../../shared/error";
import type { HandleWebhookUseCase } from "../application";

interface GithubWebhookUseCases {
    handleWebhook: HandleWebhookUseCase;
}

const HANDLED_EVENTS = new Set(["installation", "installation_repositories"]);

export class GithubWebhookController {
    constructor (
        private readonly useCases: GithubWebhookUseCases,
    ){}

    execute = async (req: Request, res: Response) => {
        const payload: unknown = req.body;

        const signature = req.get("x-hub-signature-256");
        const deliveryId = req.get("x-github-delivery");
        const event = req.get("x-github-event");

        if (!event || !signature || !deliveryId) {
            throw new BadRequest("Missing GitHub webhook headers");
        }

        if (!HANDLED_EVENTS.has(event)) {
            res.status(202).send({ received: true }); // acknowledge, do nothing
        }

        if (!Buffer.isBuffer(payload)) {
          throw new UnsupportedMediaType("Expected a raw JSON request body");
        }

        const data = await this.useCases.handleWebhook.execute({ signature, payload, event });
        console.log(">=========== webhook Data Starts ============<");
        console.log("data: ", data)
        console.log("signature: ", signature)
        console.log("deliveryId: ", deliveryId)
        console.log("eventName: ", event)
        console.log(">=========== webhook Data Ends ============<");

        res.status(202).send({ received: true });
    };
}
