import { define } from "typeorm-seeding";
import Faker from "faker";
import { AuthIdentity } from "@app/auth/index.entity";

define(AuthIdentity, (_faker: typeof Faker) => {
  const auth = new AuthIdentity();
  return auth;
});
