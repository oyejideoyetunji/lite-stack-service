import type { GithubInstallationResponse, GithubRepositoryResponse } from "../../../../shared/types";
import type { InstallationEventCommand } from "../../application/dto";
import type { RepositoriesEventCommand } from "../../application/dto";

const INSTALLATION_ACTIONS = new Set(["created", "deleted", "suspend", "unsuspend", "new_permissions_accepted"]);
const REPO_ACTIONS = new Set(["added", "removed"]);

// presentation/github-webhook.mapper.ts
export function mapWebhookPayload(event: string, payload: any): InstallationEventCommand | RepositoriesEventCommand | null {
    if (event === "installation" && INSTALLATION_ACTIONS.has(payload.action)) {
        return {
            type: "installation",
            action: payload.action,
            installation: toInstallation(payload.installation),
            repositories: (payload.repositories ?? []).map(toRepository),
        };
    }
    if (event === "installation_repositories" && REPO_ACTIONS.has(payload.action)) {
        return {
            type: "installation_repositories",
            action: payload.action,
            installation: toInstallation(payload.installation),
            repositoriesAdded: (payload.repositories_added ?? []).map(toRepository),
            repositoriesRemoved: (payload.repositories_removed ?? []).map(toRepository),
        };
    }
    return null; // ignored event
}

export const toInstallation = (i: GithubInstallationResponse) => ({
    githubInstallationId: i.id,
    githubAccountId: i.account.id,
    accountLogin: i.account.login,
    accountType: i.account.type,
    repositorySelection: i.repository_selection,
    permissions: i.permissions,
    suspendedAt: i.suspended_at ? new Date(i.suspended_at) : null,
});

export const toRepository = (r: GithubRepositoryResponse) => ({
    githubRepoId: r.id,
    fullName: r.full_name,
    isPrivate: r.private,
});
