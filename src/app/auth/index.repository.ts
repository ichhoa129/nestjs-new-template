import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/services/crud/base-repo";
import { AuthIdentity } from "./index.entity";
import { User } from "@app/user/index.entity";

@EntityRepository(AuthIdentity)
export class AuthRepository extends BaseCrudRepository<AuthIdentity> {
  async saveRefreshToken(user: User, refresh_token: string) {
    const user_auth = await this.findOne({
      where: {
        user,
      },
      select: ["id"],
    });

    if (!user_auth) {
      await this.createOne({
        refresh_token,
        user,
      });
    } else {
      await this.updateOne(user_auth.id, {
        refresh_token,
      });
    }
  }

  async updateTokenOrFail(
    refresh_token: string,
    payload: string,
  ): Promise<AuthIdentity> {
    const identity = await this.findOneOrFail({
      where: {
        refresh_token,
      },
      select: ["id"],
    });

    return this.updateOne(identity.id, {
      refresh_token: payload,
    });
  }
}
