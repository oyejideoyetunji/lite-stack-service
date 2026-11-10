import type { Request, Response } from "express";
import { Unauthorized } from "../../../shared/error";
import type {
  CompleteGithubInstallationUseCase,
  StartGithubInstallationUseCase,
} from "../application";

interface GithubUseCases {
  startInstallation: StartGithubInstallationUseCase;
  completeInstallation: CompleteGithubInstallationUseCase;
}

export class GithubController {
  constructor(private readonly useCases: GithubUseCases) {}

  startInstallation = async (req: Request, res: Response) => {
    const auth = req.auth;

    if (!auth) {
      throw new Unauthorized();
    }

    const attemptTag = await this.useCases.startInstallation.execute(
      auth.userId,
    );

    res
      .status(201)
      .send({
        installation_url: `https://github.com/apps/lyte-stack/installations/new?state=${attemptTag}`,
      });
  };

  completeInstallation = async (req: Request, res: Response) => {
    const auth = req.auth;

    if (!auth) {
      throw new Unauthorized();
    }

    const body = req.body;

    const installation = await this.useCases.completeInstallation.execute({
      ...body,
      userId: auth.userId,
    });

    console.log(">=======Complete Installation Starts Here=========<");
    console.log("The returned installation: ", installation)
    console.log(">=======Complete Installation Ends Here=========<");

    res.status(201).send(installation);
  };
}
