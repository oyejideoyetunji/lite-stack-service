import type { InstallationState, NewInstallationState } from "../../../../shared/types";

export interface InstallationStateRepository {
  start(payload: NewInstallationState): Promise<InstallationState | undefined>;
  // complete(): Promise<InstallationState | undefined>;
}
