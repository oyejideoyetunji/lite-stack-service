import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

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
