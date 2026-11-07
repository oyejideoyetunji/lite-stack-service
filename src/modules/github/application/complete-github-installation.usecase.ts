import { config } from "../../../shared/config";
import { BadRequest } from "../../../shared/error";
import type { InstallationStateRepository } from "../domain/repository";

type InstallationParams = {
  code: string;
  state: string;
  userId: string;
}

export class CompleteGithubInstallationUseCase {
  constructor(
    private readonly installationStates: InstallationStateRepository
  ) {}

  async execute({ code, state, userId }: InstallationParams) {
    // validate the installation state 
    const pendingState = await this.installationStates.get(state, userId);

    if (!pendingState) {
      throw new BadRequest("Invalid or expired installation state");
    }

    const userToken = await exchangeGithubOAuthCode(code);
    const user = await getGithubUser(userToken);
    const installations = await getGithubUserInstallations(userToken);

    console.log(">========= Callback Here ===========<")
    console.log("userToken: ", userToken)
    console.log("user: ", user)
    console.log("installations: ", installations)
    console.log(">========= Callback Here ===========<")
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

type GithubUserResponse = {
  login: string;
  id: number,
}

async function getGithubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user github information");
  }

  return (await response.json()) as GithubUserResponse;
}

async function getGithubUserInstallations(accessToken: string) {
  const response = await fetch("https://api.github.com/user/installations", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user github installations information");
  }
  
  return await response.json() as any;
}
