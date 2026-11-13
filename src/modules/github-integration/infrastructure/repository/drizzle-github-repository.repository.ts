import { isNull, inArray, sql, eq, and } from "drizzle-orm";
import { githubRepositories, type DbExecutor } from "../../../../shared/db";
import type { NewGithubRepositoryPayload } from "../../../../shared/types";
import type { GithubRepositoryRepository } from "../../domain/repository";

export class DrizzleGithubRepositoryRepository implements GithubRepositoryRepository {
  constructor(private readonly db: DbExecutor) {}
    async upsertMany(repos: NewGithubRepositoryPayload[]) {
        if (repos.length === 0) return [];

        const result = await this.db
          .insert(githubRepositories)
          .values(repos)
          .onConflictDoUpdate({
            target: [githubRepositories.installationId, githubRepositories.githubRepoId],
            set: {
              fullName: sql`excluded.full_name`,
              isPrivate: sql`excluded.is_private`,
              removedAt: null,
              updatedAt: new Date(),
            },
          })
          .returning();

          return result;
    }

    async markRemoved(installationId: string, githubRepoIds?: number[]): Promise<void> {
      if (githubRepoIds && githubRepoIds.length === 0) return; // nothing to remove
  
      await this.db
        .update(githubRepositories)
        .set({ removedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(githubRepositories.installationId, installationId),
            isNull(githubRepositories.removedAt),
            githubRepoIds === undefined ? githubRepoIds : inArray(githubRepositories.githubRepoId, githubRepoIds)
          )
        );
    }
}
