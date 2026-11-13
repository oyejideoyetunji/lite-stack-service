import { eq } from "drizzle-orm";
import { githubInstallations, type DbExecutor } from "../../../../shared/db";
import type { NewGithubInstallationPayload } from "../../../../shared/types";
import type { GithubInstallationRepository } from "../../domain/repository";

export class DrizzleGithubInstallationRepository implements GithubInstallationRepository {
  constructor(private readonly db: DbExecutor) { }

  async insertIfAbsent(values: NewGithubInstallationPayload) {
    await this.db
      .insert(githubInstallations)
      .values(values)
      .onConflictDoNothing({ target: githubInstallations.githubInstallationId });

    const row = await this.findByGithubId(values.githubInstallationId);

    if (!row) throw new Error("Installation missing after insert (invariant violated)");

    return row;
  }

  async findByGithubId(githubInstallationId: number) {
    const [row] = await this.db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.githubInstallationId, githubInstallationId));
    return row;
  }

  async upsert(data: NewGithubInstallationPayload) {
    const [row] = await this.db
      .insert(githubInstallations)
      .values(data)
      .onConflictDoUpdate({
        target: githubInstallations.githubInstallationId,
        set: { ...data, updatedAt: new Date() },
      })
      .returning();

    if (!row) {
      throw new Error(
        `Upsert returned no row for github installation ${data.githubInstallationId}`,
      );
    }
    return row;
  }

  async markDeleted(id: string) {
    await this.db
      .update(githubInstallations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(githubInstallations.id, id));
  }
}
