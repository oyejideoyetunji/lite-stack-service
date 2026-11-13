import type { githubRepositories } from "../db";

export type GithubRepository = typeof githubRepositories.$inferSelect;
export type NewGithubRepositoryPayload = typeof githubRepositories.$inferInsert;

export type GithubRepositoryResponse = { id: number; full_name: string; private: boolean };
