import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * @Usage The main custom decorator to get current authenticated user.
 */
export const GetAuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
