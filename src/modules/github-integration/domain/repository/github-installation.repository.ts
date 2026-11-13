import type { GithubInstallation, NewGithubInstallationPayload } from "../../../../shared/types";

export interface GithubInstallationRepository {
  insertIfAbsent(data: NewGithubInstallationPayload): Promise<GithubInstallation>; // callback
  upsert(data: NewGithubInstallationPayload): Promise<GithubInstallation>;         // webhooks
  findByGithubId(githubInstallationId: number): Promise<GithubInstallation | undefined>;
  markDeleted(id: string): Promise<void>;
}
