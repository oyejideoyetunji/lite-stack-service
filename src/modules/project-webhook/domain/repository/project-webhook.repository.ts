export interface ProjectWebhookRepository {
  create(): Promise<void>;
}
