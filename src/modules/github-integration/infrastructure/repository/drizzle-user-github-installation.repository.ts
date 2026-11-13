import { userGithubInstallations, type DbExecutor } from "../../../../shared/db";
import type { UserGithubInstallationRepository } from "../../domain/repository";

export class DrizzleUserGithubInstallationRepository implements UserGithubInstallationRepository {
  constructor(private readonly db: DbExecutor) {}

  async link(userId: string, installationId: string) {
    await this.db
      .insert(userGithubInstallations)
      .values({ userId, installationId })
      .onConflictDoNothing();
  }
}
