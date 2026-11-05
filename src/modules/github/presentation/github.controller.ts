import type { Request, Response } from "express";
import { Unauthorized } from "../../../shared/error";
import type { StartGithubInstallationUseCase } from "../application";

interface GithubUseCases {
    startInstallation: StartGithubInstallationUseCase;
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
}
