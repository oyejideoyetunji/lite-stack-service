import { config } from "../../../../shared/config";
import { BadRequest } from "../../../../shared/error";
import type { GithubInstallationResponse, GithubRepositoryResponse } from "../../../../shared/types";
import type { GithubApiClient, GithubTokenResponse, GithubUserResponse } from "../../domain/clients";


export class GithubAppApiClient implements GithubApiClient {
  async exchangeCodeForUserToken(code: string) {
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

  async findUserInstallation(token: string, installationId: number) {
    const perPage = 100;

    for (let page = 1; ; page++) {
      const response = await fetch(`https://api.github.com/user/installations?per_page=${perPage}&page=${page}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
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

  async listUserInstallationRepos(token: string, installationId: number) {
    const perPage = 100;
    const all: GithubRepositoryResponse[] = [];

    for (let page = 1; ; page++) {
      const res = await fetch(
        `https://api.github.com/user/installations/${installationId}/repositories?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2026-03-10",
          }
        }
      );
      if (!res.ok) throw new Error(`GitHub ${res.status}`);

      const data = (await res.json()) as { repositories: GithubRepositoryResponse[] };
      all.push(...data.repositories);

      if (data.repositories.length < perPage) return all;
    }
  }

  async getGithubUser(accessToken: string) {
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
}
