import express from "express";
import cors from "cors";
import { createAuthModule } from "./modules/auth/auth.module";
import { createUserModule } from "./modules/user/user.module";
import { config } from "./shared/config";
import { errorHandler, nonOkResponseLogger, setAuthData } from "./shared/middlewares";
import { createGithubModule, createGithubWebhookModule } from "./modules/github/github.module";

const app = express();
const PORT = config.api.port;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  "/api/v1/github-webhook", 
  express.raw({ type: "application/json", limit: "25mb" }),
  createGithubWebhookModule().githubWebhookRouter
);

app.use(express.json());

app.use("/api/v1/auth", createAuthModule().router);

app.use(
  "/api/v1/github",
  setAuthData({getUserAuth: createUserModule().userUseCases.getUserAuth.execute}),
  createGithubModule().githubRouter
);

app.use("/api/v1/users", setAuthData({getUserAuth: createUserModule().userUseCases.getUserAuth.execute}), createUserModule().router);

app.use("", (_, res) => {
  res.status(200).send({ "message": "OK" });
});

app.use(nonOkResponseLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
