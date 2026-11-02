import { Router } from "express";
import { z } from "zod";
import { validateRequestData } from "../../../shared/middlewares";
import type { AuthController } from "./auth.controller";

export function authRoutes(controller: AuthController) {
    const router: Router = Router();
    
    router.post("/login", validateRequestData(loginSchema), controller.login);
    router.post("/register", validateRequestData(registerUserSchema), controller.register);

    return router;
}

const registerUserSchema = z.object({
    body: z.object({
        email: z.email(),
        username: z.string().min(3),
        password: z.string().min(8)
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8)
    })
});

