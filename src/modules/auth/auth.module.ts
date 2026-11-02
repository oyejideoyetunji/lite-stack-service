import { createUserModule } from "../user/user.module";
import { RegisterUserUseCase } from "./application";
import { LoginUseCase } from "./application/login.usecase";
import { UserModuleGateWay } from "./infrastructure/gate-ways";
import { PasswordHasherPort, TokenIssuerPort } from "./infrastructure/ports";
import { AuthController } from "./presentation/auth.controller";
import { authRoutes } from "./presentation/auth.routes";

export function createAuthModule() {
    const userModule = createUserModule();
    const authUseCases = {
        register: new RegisterUserUseCase(
            new UserModuleGateWay(userModule.userUseCases),
            new PasswordHasherPort()
        ),
        login: new LoginUseCase(
            new UserModuleGateWay(userModule.userUseCases),
            new TokenIssuerPort(),
            new PasswordHasherPort()
        )
    };
    const router = authRoutes(new AuthController(authUseCases));

    return { router };
}
