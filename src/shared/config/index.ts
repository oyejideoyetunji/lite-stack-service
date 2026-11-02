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
const url = getEnvVar("DB_URL");
const platform = getEnvVar("PLATFORM");
const jwtSecrete = getEnvVar("JWT_SECRETE");
const webhookSecret = getEnvVar("WEBHOOK_SECRET");

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    port: number;
    platform: string;
    jwtSecrete: string;
    webhookSecret: string;
};

type Config = {
    db: DBConfig;
    api: APIConfig;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/shared/db",
};

const db: DBConfig = {
    url,
    migrationConfig,
};

const api: APIConfig = {
    port: Number(port),
    platform,
    jwtSecrete,
    webhookSecret,
};

export const config: Config = {
    db,
    api
};
