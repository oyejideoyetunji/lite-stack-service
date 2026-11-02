import type { NewUserPayload } from "../../../../shared/types";
import type { UserModule } from "../../../user/user.module";
import type { UserGateWay } from "../../domain/gate-ways";

export class UserModuleGateWay implements UserGateWay {
    constructor (
        private readonly userUseCase: Pick<UserModule["userUseCases"], "createUser" | "getUserAuth">
    ) {}

    createUser = async (payload: NewUserPayload) => {
        return await this.userUseCase.createUser.execute(payload);
    }

    getUserAuth = async (email: string) => {
        return await this.userUseCase.getUserAuth.execute(email);
    }
}
