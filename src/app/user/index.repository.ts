import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/services/crud/base-repo";
import { User } from "./index.entity";
import { BadRequestException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends BaseCrudRepository<User> {
  async checkDuplicateEmail(email: string) {
    const is_user_exists = await this.findOne({
      where: {
        email: email,
      },
    });
    if (is_user_exists) {
      // TODO: Throw duplicate error format
      throw new BadRequestException();
    }
  }
}
