import { and, eq, gt, isNull } from "drizzle-orm";
import { db, githubInstallations, installationStates, userGithubInstallations } from "../../../../shared/db";
import type { GithubInstallationResponse } from "../../../../shared/types";
import { installationValues } from "../shared";

export async function completeGithubInstallationTransaction(params: {
  userId: string;        // authenticated platform user
  stateHash: string;     // hash of the `state` from the request
  installationResponse: GithubInstallationResponse; // the match from GET /user/installations
}) {
  const { userId, stateHash, installationResponse } = params;

  await db.transaction(async (tx) => {
    // 1. Consume the state atomically. The conditions make it single-use,
    //    unexpired, and bound to this user, even with concurrent requests.
    const [state] = await tx
      .update(installationStates)
      .set({ consumedAt: new Date() })
      .where(
        and(
          eq(installationStates.stateHash, stateHash),
          eq(installationStates.userId, userId),
          isNull(installationStates.consumedAt),
          gt(installationStates.expiresAt, new Date())
        )
      )
      .returning({ id: installationStates.id });

    if (!state) throw new Error("Invalid, expired or already used state");

    // 2. Make sure the installation row exists. DO NOTHING (not update):
    //    webhooks are the source of truth for installation data, and this
    //    snapshot could be older than what a webhook already wrote.
    const [installation] = await tx
      .insert(githubInstallations)
      .values(installationValues(installationResponse))
      .onConflictDoNothing()
      .returning();

    if (!installation) throw new Error("Failed to create installation record on our system");

    // 3. Link the user. Repeat callbacks cause no duplicates.
    await tx
      .insert(userGithubInstallations)
      .values({ userId, installationId: installation.id })
      .onConflictDoNothing();

    return installation;
  });
}
