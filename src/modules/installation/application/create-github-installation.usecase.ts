import { Unauthorized } from "../../../shared/error";
import type { SignatureManager } from "../domain/ports";

type EventParams = {
  signature: string | undefined;
  payload: Buffer;
}

export class CreateGithubInstallationUseCase {
  constructor(private readonly signatureManager: SignatureManager) {}

  execute(event: EventParams) {
    if (!this.signatureManager.verify(event.signature, event.payload)) {
      throw new Unauthorized();
    }

    let data: unknown;

    try {
      data = JSON.parse(event.payload.toString("utf8"));
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
