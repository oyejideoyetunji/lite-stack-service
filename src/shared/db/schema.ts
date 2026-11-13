import { bigint, boolean, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "client",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true } ).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").default("unset").notNull(),
  role: userRoleEnum().notNull().default("client")
});

export const installationStates = pgTable("installation_states", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  stateHash: varchar("state_hash").unique().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull()
});

export const githubInstallations = pgTable("github_installations", {
  id: uuid("id").primaryKey().defaultRandom(),
  githubInstallationId: bigint("github_installation_id", { mode: "number" }).notNull().unique(),
  githubAccountId: bigint("github_account_id", { mode: "number" }).notNull(),
  accountLogin: text("account_login").notNull(),
  accountType: text("account_type", { enum: ["User", "Organization"] }).notNull(),
  repositorySelection: text("repository_selection", { enum: ["all", "selected"] }).notNull(),
  permissions: jsonb("permissions").$type<Record<string, string>>().notNull().default({}),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft delete on `installation.deleted`
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const userGithubInstallations = pgTable("user_github_installations", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  installationId: uuid("installation_id").notNull()
    .references(() => githubInstallations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.installationId] })]);

export const githubRepositories = pgTable("github_repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  installationId: uuid("installation_id").notNull()
    .references(() => githubInstallations.id, { onDelete: "cascade" }),
  githubRepoId: bigint("github_repo_id", { mode: "number" }).notNull(),
  fullName: text("full_name").notNull(),
  isPrivate: boolean("is_private").notNull(),
  removedAt: timestamp("removed_at", { withTimezone: true }), // access revoked, keep row so services don't dangle
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("github_repos_installation_repo_uq").on(t.installationId, t.githubRepoId),
]);
