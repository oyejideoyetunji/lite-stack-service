import type { Request, Response } from "express"
import type { CreateUserUseCase, GetUsersUseCase } from "../application";
import type { FindUserByEmailUseCase } from "../application/find-user-by-email.usecase";
import type { GetUserAuthUseCase } from "../application/get-user-auth.usecase";

interface UserUseCases {
    getUsers: GetUsersUseCase;
    createUser: CreateUserUseCase;
    getUserAuth: GetUserAuthUseCase;
    findUserByEmail: FindUserByEmailUseCase;
}

export class UserController {
    constructor(private readonly useCaeses: UserUseCases) {}

    create = async (req: Request, res: Response) => {
        const user = await this.useCaeses.createUser.execute(req.body);

        res.status(201).send(user);
    }

    getAll = async (req: Request, res: Response) => {
        const users = await this.useCaeses.getUsers.execute();

        res.status(200).send(users);
    }
}
