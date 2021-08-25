import { Role } from "@app/role/index.entity";
import { User } from "@app/user/index.entity";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * @Usage The main authentication guard used to implement to authorization routes
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchAccess(
    serverAccess: Array<number>,
    clientAccess: Array<Role>,
  ): boolean {
    const clientRoles: Array<number> = clientAccess.map((role) => role.id);
    console.log(clientRoles);
    console.log(serverAccess);
    for (let i = 0; i < serverAccess.length; i++) {
      const role = serverAccess[i];
      if (clientRoles.includes(role)) {
        return true;
      }
    }
    return false;
  }

  canActivate(context: ExecutionContext): boolean {
    const access = this.reflector?.get<any>("roles", context.getHandler());
    if (!access) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user.roles) {
      return false;
    }
    return this.matchAccess(access, user.roles);
  }
}
