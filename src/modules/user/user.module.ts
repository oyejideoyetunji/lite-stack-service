import { CreateUserUseCase, GetUsersUseCase } from "./application";
import { FindUserByEmailUseCase } from "./application/find-user-by-email.usecase";
import { GetUserAuthUseCase } from "./application/get-user-auth.usecase";
import { OrmUserRepository } from "./infrastructure";
import { UserController } from "./presentation/user.controller";
import { userRoutes } from "./presentation/user.routes";

export function createUserModule() {
    const repo = new OrmUserRepository();
    const userUseCases = {
        getUsers: new GetUsersUseCase(repo),
        createUser: new CreateUserUseCase(repo),
        getUserAuth: new GetUserAuthUseCase(repo),
        findUserByEmail: new FindUserByEmailUseCase(repo),
    }
    
    const router = userRoutes(new UserController(userUseCases));

    return { router, userUseCases };
}

export type UserModule = ReturnType<typeof createUserModule>;
