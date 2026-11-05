import type { installationStates } from "../db";

export type InstallationState = typeof installationStates.$inferSelect;
export type NewInstallationState = typeof installationStates.$inferInsert;
