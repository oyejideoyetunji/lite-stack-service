import { createHash, randomBytes } from "node:crypto";
import type { StateTokenManager } from "../../domain/ports";

export class CryptoStateTokenManager implements StateTokenManager {
  constructor(private readonly bytes = 32) {}

  generate() {
    const token = randomBytes(this.bytes).toString("base64url");
    return { token, hash: this.hash(token) };
  }

  hash(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
}