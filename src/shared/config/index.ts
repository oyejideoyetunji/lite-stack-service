import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");

if (process.env.RENDER !== "true" && existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

import type { MigrationConfig } from "drizzle-orm/migrator";

function getEnvVar(key: string) {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Failed to load env variable ${key}`);
    }

    return value;
}

const port = getEnvVar("PORT");
const dbUrl = getEnvVar("DB_URL");
const platform = getEnvVar("PLATFORM");
const jwtSecret = getEnvVar("JWT_SECRET");
const githubAppWebhookSecret = getEnvVar("GITHUB_APP_WEBHOOK_SECRET");
const githubAppClientSecret = getEnvVar("GITHUB_APP_CLIENT_SECRET");
const githubAppClientId = getEnvVar("GITHUB_APP_CLIENT_ID");

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    port: number;
    platform: string;
    jwtSecret: string;
    githubAppWebhookSecret: string;
    githubAppClientSecret: string;
    githubAppClientId: string;
};

type Config = {
    db: DBConfig;
    api: APIConfig;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/shared/db",
};

const db: DBConfig = {
    url: dbUrl,
    migrationConfig,
};

const api: APIConfig = {
    port: Number(port),
    platform,
    jwtSecret,
    githubAppWebhookSecret,
    githubAppClientSecret,
    githubAppClientId,
};

export const config: Config = {
    db,
    api
};
