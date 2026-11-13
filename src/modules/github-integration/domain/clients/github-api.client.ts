import type { GithubInstallationResponse, GithubRepositoryResponse } from "../../../../shared/types";

export type GithubUserResponse = {
    login: string;
    id: number,
}

export type GithubTokenResponse = {
    access_token?: string;
    token_type?: string;
    scope?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
    error?: string;
    error_description?: string;
}


// domain/clients/github-api.client.ts
export interface GithubApiClient {
    exchangeCodeForUserToken(code: string): Promise<string>;
    findUserInstallation(token: string, githubInstallationId: number): Promise<GithubInstallationResponse | null>;
    listUserInstallationRepos(token: string, githubInstallationId: number): Promise<GithubRepositoryResponse[]>;
    getGithubUser(accessToken: string): Promise<GithubUserResponse>;
}
