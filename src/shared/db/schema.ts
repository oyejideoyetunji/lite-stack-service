import { pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "client",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password").default("unset").notNull(),
  role: userRoleEnum().notNull().default("client")
});

export const installationStates = pgTable("installation_states", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  consumedAt: timestamp("consumed_at"),
  expiresAt: timestamp("expires_at").notNull(),
  stateHash: varchar("state_hash").unique().notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull()
});

export const installations = pgTable("installations", {
  id: uuid("id").defaultRandom().primaryKey(),
  installationId: text("installation_id").notNull().unique(),
  suspendedAt: timestamp("suspended_at"),
  uninstalledAt: timestamp("uninstalled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),

  // GitHub account or organization information.
  // accountId: text("account_id").notNull(),
  // accountType: varchar("account_type", { length: 50 }).notNull(),
  // accountLogin: varchar("account_login", { length: 255 }).notNull(),
  // userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
});

// user-github-installations.schema.ts

export const userInstallations = pgTable(
  "user_installations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    installationId: uuid("installation_id").notNull().references(() => installations.id, { onDelete: "cascade" }),
    disconnectedAt: timestamp("disconnected_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),

    // The GitHub user who authorized the connection.
    githubUserId: text("github_user_id").notNull(),
    githubLogin: varchar("github_login", { length: 255 }).notNull(),
  },
  (table) => [
    unique("user_installations_unique").on(table.userId, table.installationId),
  ],
);
