import type { GithubInstallationResponse } from "../../../../shared/types";

export const installationValues = (i: GithubInstallationResponse) => ({
  githubInstallationId: i.id,
  githubAccountId: i.account.id,
  accountLogin: i.account.login,
  accountType: i.account.type,
  repositorySelection: i.repository_selection,
  permissions: i.permissions,
  suspendedAt: i.suspended_at ? new Date(i.suspended_at) : null,
});
