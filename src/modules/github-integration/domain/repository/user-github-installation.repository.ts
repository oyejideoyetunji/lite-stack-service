export interface UserGithubInstallationRepository {
  link(userId: string, installationId: string): Promise<void>;
}