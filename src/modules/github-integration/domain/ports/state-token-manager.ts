export interface StateTokenManager {
  /** Creates a new random token. Send `token` to GitHub, store only `hash`. */
  generate(): { token: string; hash: string };

  /** Deterministic hash, used to look up the row when the callback returns. */
  hash(token: string): string;
}
