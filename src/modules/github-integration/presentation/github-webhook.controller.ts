import type { Request, Response } from "express";
import { mapWebhookPayload } from "../infrastructure/mappers";
import type { ApplyInstallationEventUseCase, ApplyRepositoryEventUseCase } from "../application";

interface GithubWebhookUseCases {
    applyInstallationEvent: ApplyInstallationEventUseCase;
    applyRepositoriesEvent: ApplyRepositoryEventUseCase;
}

export class GithubWebhookController {
    constructor (
        private readonly useCases: GithubWebhookUseCases,
    ){}

    execute = async (req: Request, res: Response) => {
        const event = req.header("x-github-event")!;
        const payload = JSON.parse((req.body as Buffer).toString("utf8"));
    
        const command = mapWebhookPayload(event, payload); // returns null if not handled
        if (!command) return res.sendStatus(202);

        if (command.type === "installation") {
            await this.useCases.applyInstallationEvent.execute(command);
        }

        if (command.type === "installation_repositories") {
            await this.useCases.applyRepositoriesEvent.execute(command);
        }

        res.status(202).send({ message: "Ok" });
    };
}
