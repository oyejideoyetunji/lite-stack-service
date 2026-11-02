import * as argon2 from "argon2";
import type { PasswordHasher } from "../../domain/ports";

export class PasswordHasherPort implements PasswordHasher {
    hash = async (password: string) => {
        return await argon2.hash(password);
    }

    verify = async (hash: string, password: string) => {
        return await argon2.verify(hash, password);
    }
}
