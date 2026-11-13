import type { InstallationState, NewInstallationState } from "../../../../shared/types";

export interface InstallationStateRepository {
  create(payload: NewInstallationState): Promise<InstallationState | undefined>;
  consume(hash: string, userId: string): Promise<InstallationState | undefined>;
}
