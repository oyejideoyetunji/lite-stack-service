import { config } from "../../../shared/config";
import { BadRequest, Forbidden } from "../../../shared/error";
import type { GithubInstallationResponse } from "../../../shared/types";
import type { InstallationStateRepository } from "../domain/repository";
import { completeGithubInstallationTransaction } from "../infrastructure/transactions";

type InstallationParams = {
  code: string;
  state: string;
  userId: string;
  installationId: string;
}

export class CompleteGithubInstallationUseCase {
  constructor(
    private readonly installationStates: InstallationStateRepository
  ) {}

  async execute({ code, state: stateHash, userId, installationId }: InstallationParams) {
    const pendingState = await this.installationStates.get(stateHash, userId);

    if (!pendingState) {
      throw new BadRequest("Invalid or expired installation state");
    }

    const userToken = await exchangeGithubOAuthCode(code);
    // const user = await getGithubUser(userToken);
    const installationResponse = await getGithubUserInstallation(userToken, installationId);
    console.log("installation response is: ", installationResponse);

    if(!installationResponse) {
      throw new Forbidden("User does not have access to this installation");
    }
    
    const installation = await completeGithubInstallationTransaction({
      userId,
      stateHash,
      installationResponse
    })

    return installation;
  }
}

type GithubTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  error?: string;
  error_description?: string;
}

async function exchangeGithubOAuthCode(
    code: string,
  ): Promise<string> {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: config.api.githubAppClientId,
          client_secret: config.api.githubAppClientSecret,
        }),
      },
    );
  
    const result = (await response.json()) as GithubTokenResponse;
  
    if (!response.ok || !result.access_token) {
      throw new BadRequest(
        result.error_description ?? "GitHub OAuth failed",
      );
    }
  
    return result.access_token;
}

// type GithubUserResponse = {
//   login: string;
//   id: number,
// }

// async function getGithubUser(accessToken: string) {
//   const response = await fetch("https://api.github.com/user", {
//     headers: {
//       Accept: "application/vnd.github+json",
//       Authorization: `Bearer ${accessToken}`,
//       "X-GitHub-Api-Version": "2026-03-10",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to get user github information");
//   }

//   return (await response.json()) as GithubUserResponse;
// }


async function getGithubUserInstallation(accessToken: string, installationId: string) {
  const perPage = 100;

  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com/user/installations?per_page=${perPage}&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to get user github installations information");
    }

    const data = (await response.json()) as {
      total_count: number;
      installations: GithubInstallationResponse[];
    };

    const match = data.installations.find((i) => i.id === Number(installationId));
    if (match) return match;

    if (data.installations.length < perPage) return null; // last page
  }
  
}
