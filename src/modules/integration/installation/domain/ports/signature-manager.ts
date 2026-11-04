export interface SignatureManager {
  verify(signature: string | undefined, payload: Buffer): boolean;
}
