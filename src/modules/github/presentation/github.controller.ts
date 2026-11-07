import type { Request, Response } from "express";
import { Unauthorized } from "../../../shared/error";
import type { CompleteGithubInstallationUseCase, StartGithubInstallationUseCase } from "../application";

interface GithubUseCases {
    startInstallation: StartGithubInstallationUseCase;
    completeInstallation: CompleteGithubInstallationUseCase;
}

export class GithubController {
    constructor (
        private readonly useCases: GithubUseCases,
    ){}

    startInstallation = async (req: Request, res: Response) => {
        const auth = req.auth;

        if (!auth) {
            throw new Unauthorized();
        }

        const attemptTag = await this.useCases.startInstallation.execute(auth.userId);

        res.status(201).send({ installation_url: `https://github.com/apps/lyte-stack/installations/new?state=${attemptTag}` });
    }

    completeInstallation = async (req: Request, res: Response) => {
        const auth = req.auth;

        if (!auth) {
            throw new Unauthorized();
        }

        const body = req.body;

        await this.useCases.completeInstallation.execute({ code: body?.code, state: body?.state, userId: auth.userId });

        res.status(201).send({ message: "received" });
    }
}
