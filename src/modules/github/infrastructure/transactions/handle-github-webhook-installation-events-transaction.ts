import { isNull, and, eq, sql, inArray } from "drizzle-orm";
import { db, githubInstallations, githubRepositories, type Tx } from "../../../../shared/db";
import type { GithubInstallationResponse, GithubRepositoryResponse } from "../../../../shared/types";
import { installationValues } from "../shared";


export async function handleGithubWebhookInstallationEventsTransaction
  (event: string, payload: any) {
  const installationPayload: GithubInstallationResponse | undefined = payload.installation;
  if (!installationPayload) return; // not an installation-related event

  await db.transaction(async (tx) => {
    const values = installationValues(installationPayload);

    const [installation] = await tx
      .insert(githubInstallations)
      .values(values)
      .onConflictDoUpdate({
        target: githubInstallations.githubInstallationId,
        set: { ...values, updatedAt: new Date() },
      }).returning();

    if (!installation) throw new Error("Failed to create installation record from webhook event on our system");

    switch (`${event}.${payload.action}`) {
      case "installation.created":
        await upsertRepos(tx, installation.id, payload.repositories ?? []);
        break;

      case "installation.deleted":
        await tx
          .update(githubInstallations)
          .set({ deletedAt: new Date() })
          .where(eq(githubInstallations.githubInstallationId, installation.githubInstallationId));
        await markReposRemoved(tx, installation.id);
        break;

      case "installation_repositories.added":
        await upsertRepos(tx, installation.id, payload.repositories_added ?? []);
        break;

      case "installation_repositories.removed":
        await markReposRemoved(
          tx,
          installation.id,
          (payload.repositories_removed ?? []).map((r: GithubRepositoryResponse) => r.id)
        );
        break;

      // suspend / unsuspend / new_permissions_accepted: handled by the upsert above
    }
  });
}

export async function upsertRepos(tx: Tx, installationId: string, repos: GithubRepositoryResponse[]) {
  if (repos.length === 0) return;

  await tx
    .insert(githubRepositories)
    .values(
      repos.map((r) => ({
        installationId,
        githubRepoId: r.id,
        fullName: r.full_name,
        isPrivate: r.private,
      }))
    )
    .onConflictDoUpdate({
      target: [githubRepositories.installationId, githubRepositories.githubRepoId],
      set: {
        fullName: sql`excluded.full_name`,
        isPrivate: sql`excluded.is_private`,
        removedAt: null, // re-added repo comes back to life
        updatedAt: new Date(),
      },
    });
}

export async function markReposRemoved(tx: Tx, installationId: string, githubRepoIds?: number[]) {
  await tx
    .update(githubRepositories)
    .set({ removedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(githubRepositories.installationId, installationId),
        isNull(githubRepositories.removedAt),
        githubRepoIds ? inArray(githubRepositories.githubRepoId, githubRepoIds) : undefined
      )
    );
}