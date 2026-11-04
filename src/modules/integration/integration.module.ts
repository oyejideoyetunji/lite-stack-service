import { Router } from "express";
import { createInstallationModule } from "./installation/installation.module";

export function createIntegrationModule() {
  const router: Router = Router();

  router.post("/installation", createInstallationModule().router);

  return { router };
}
