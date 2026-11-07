import { randomBytes } from "node:crypto";

export function getByteString() {
    return randomBytes(32).toString("hex");
}
