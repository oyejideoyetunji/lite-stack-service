import express from "express";
import { createAuthModule } from "./modules/auth/auth.module";
import { createUserModule } from "./modules/user/user.module";
import { config } from "./shared/config";
import { errorHandler, nonOkResponseLogger, setAuthData } from "./shared/middlewares";
import { createProjectWebHookModule } from "./modules/project-webhook/project-webhook.module";

const app = express();
const PORT = config.api.port;

app.use("/api/v1/webhooks/github", express.raw({ type: "application/json", limit: "25mb" }), createProjectWebHookModule().router)

app.use(express.json());

app.use("/api/v1/auth", createAuthModule().router)

app.use(setAuthData({getUserAuth: createUserModule().userUseCases.getUserAuth.execute}));
app.use("/api/v1/users", createUserModule().router)

app.use("", (_, res) => {
  res.status(200).send({ "message": "OK" });
})

app.use(nonOkResponseLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
