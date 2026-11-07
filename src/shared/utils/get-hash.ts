import { createHash } from "node:crypto";

export function getHash(value: string) {
    return createHash("sha256").update(value).digest("hex");
}
