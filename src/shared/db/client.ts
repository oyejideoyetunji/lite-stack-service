import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "../config";

const con = postgres(config.db.url);
export const db = drizzle(con, { schema });
export type Database = typeof db;
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbExecutor = Database | Tx;