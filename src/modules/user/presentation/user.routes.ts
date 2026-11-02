import { Router } from "express";
import { z } from "zod";
import type { UserController } from "./user.controller";
import { validateRequestData } from "../../../shared/middlewares";

export function userRoutes(controller: UserController) {
    const router: Router = Router();

    router.post("", validateRequestData(createUserSchema), controller.create);
    router.get("", controller.getAll);

    return router;
}

const createUserSchema = z.object({
    body: z.object({
        email: z.email(),
        username: z.string().min(3),
    })
});
