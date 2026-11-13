import { BadRequest, Forbidden } from "../../../shared/error";
import type { GithubApiClient } from "../domain/clients";
import type { StateTokenManager, UnitOfWork } from "../domain/ports";
import type { GithubRepositoryRepository } from "../domain/repository";
import { toInstallation, toRepository } from "../infrastructure/mappers";

type InstallationParams = {
  code: string;
  state: string;
  userId: string;
  installationId: number;
}

export class CompleteGithubInstallationUseCase {
  constructor(
    private readonly github: GithubApiClient,
    private readonly tokens: StateTokenManager,
    private readonly unitOfWork: UnitOfWork,
    private readonly repoRepository: GithubRepositoryRepository,
  ) { }

  async execute({ code, state, userId, installationId: githubInstallationId }: InstallationParams) {
    const stateHash = this.tokens.hash(state);
    const token = await this.github.exchangeCodeForUserToken(code);
    const installationResponse = await this.github.findUserInstallation(token, githubInstallationId);

    if (!installationResponse) {
      throw new Forbidden("User does not have access to this installation");
    }

    const installation = await this.unitOfWork.run(async ({ states, installations, userInstallations }) => {
      if (!(await states.consume(stateHash, userId))) throw new BadRequest("invalide installation state");
      const inst = await installations.insertIfAbsent(toInstallation(installationResponse)); // insert, then select
      await userInstallations.link(userId, inst.id);
      return inst;
    });

    const repositoriesResponse = await this.github.listUserInstallationRepos(token, installation.githubInstallationId);
    const repositories = await this.repoRepository.upsertMany(repositoriesResponse.map(repo => ({ ...toRepository(repo), installationId: installation.id })));

    return {
      installation: {
        id: installation.id,
        accountLogin: installation.accountLogin,
        accountType: installation.accountType,
        repositorySelection: installation.repositorySelection,
      },
      repositories,
    };
  }
}
