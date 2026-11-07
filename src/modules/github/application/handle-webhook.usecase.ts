import { Unauthorized } from "../../../shared/error";
import type { SignatureManager } from "../domain/ports";

type EventParams = {
  signature: string | undefined;
  payload: Buffer;
}

export class HandleWebhookUseCase {
  constructor(private readonly signatureManager: SignatureManager) {}

  execute(params: EventParams) {
    if (!this.signatureManager.verify(params.signature, params.payload)) {
      throw new Unauthorized();
    }

    let data: unknown;

    try {
      data = JSON.parse(params.payload.toString("utf8"));
    } catch {
      throw new Unauthorized();
    }

    if (!isRecord(data)) {
      throw new Unauthorized();
    }

    return data;
  }
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
