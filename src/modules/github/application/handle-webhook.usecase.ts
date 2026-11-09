import { Unauthorized } from "../../../shared/error";
import type { SignatureManager } from "../domain/ports";
import { handleGithubWebhookInstallationEventsTransaction } from "../infrastructure/transactions";

type EventParams = {
  signature: string | undefined;
  event: string;
  payload: Buffer;
}

export class HandleWebhookUseCase {
  constructor(private readonly signatureManager: SignatureManager) {}

  execute = async ({ event, signature, payload }: EventParams) => {
    if (!this.signatureManager.verify(signature, payload)) {
      throw new Unauthorized();
    }

    let data: unknown;

    try {
      data = JSON.parse(payload.toString("utf8"));
    } catch {
      throw new Unauthorized();
    }

    if (!isRecord(data)) {
      throw new Unauthorized();
    }

    await handleGithubWebhookInstallationEventsTransaction(event, data)

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
