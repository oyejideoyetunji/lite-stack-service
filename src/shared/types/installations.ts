import type { installationStates } from "../db";

export type InstallationState = typeof installationStates.$inferSelect;
export type NewInstallationState = typeof installationStates.$inferInsert;




export type GithubInstallationResponse = {
  id: number;
  account: { id: number; login: string; type: "User" | "Organization" };
  repository_selection: "all" | "selected";
  permissions: Record<string, string>;
  suspended_at: string | null;
  app_id: number;
  events: string[];
  created_at: string;
  updated_at: string;
};

