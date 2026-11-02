import type { RegisterUserUseCase } from "../application";
import type { Request, Response } from "express";
import type { LoginUseCase } from "../application/login.usecase";

interface AuthUseCases {
    login: LoginUseCase
    register: RegisterUserUseCase
}

export class AuthController {
    constructor (
        private readonly useCases: AuthUseCases
    ){}

    register = async (req: Request, res: Response) => {
        const user = await this.useCases.register.execute(req.body);

        res.status(201).send(user);
    }

    login = async (req: Request, res: Response) => {
        const token = await this.useCases.login.execute(req.body);

        res.status(200).send({ token });
    }
}
