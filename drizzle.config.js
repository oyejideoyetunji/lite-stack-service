import { defineConfig } from "drizzle-kit";
import { config } from "./src/shared/config";

export default defineConfig({
  schema: "src/shared/db/schema.ts",
  out: "src/shared/db",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db.url,
  },
});
