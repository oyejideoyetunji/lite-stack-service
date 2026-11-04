import { createHmac, timingSafeEqual } from "node:crypto";
import type { SignatureManager } from "../../domain/ports";
import { config } from "../../../../../shared/config";

export class GithubSignatureManager implements SignatureManager {
  verify(signature: string | undefined, payload: Buffer) {
    if (!signature) {
      return false;
    }
  
    // GitHub signatures have the format:
    // sha256=<64-character hexadecimal digest>
    if (!/^sha256=[a-f0-9]{64}$/i.test(signature)) {
      return false;
    }

    const expectedSignatureString = createHmac(
      "sha256",
      config.api.webhookSecret,
    ).update(payload).digest("hex")
    const sliced_sig = signature.slice("sha256=".length);

    const expectedSignature = Buffer.from(expectedSignatureString, "hex");
    const receivedSignature = Buffer.from(sliced_sig, "hex");
  
    if (receivedSignature.length !== expectedSignature.length) {
      console.log("failed here!!!!")
      return false;
    }
  
    return timingSafeEqual(
      expectedSignature,
      receivedSignature,
    );
  }
}
