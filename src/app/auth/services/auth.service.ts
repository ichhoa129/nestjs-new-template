import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@app/user/index.service";
import { CreateUserDto } from "@app/user/dto/create-one";
import { User } from "@app/user/index.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { BaseCrudService } from "@core/services/crud/base-service";
import { AuthIdentity } from "../index.entity";
import { AuthRepository } from "../index.repository";
import { compareHashString } from "@core/services/bcrypt";
import { REFRESH_TOKEN_SECRET } from "@config/env";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { ValidationMessage } from "@core/constants/error-message";
import { TokenService } from "./jwt.service";

@Injectable()
export class AuthService extends BaseCrudService<AuthIdentity> {
  constructor(
    private tokenService: TokenService,
    private usersService: UserService,
    private repo: AuthRepository,
  ) {
    super(repo);
  }

  async signin(dto: AuthCredentialsDto) {
    const user = await this.usersService.findOneOrFail({
      where: {
        email: dto.email,
      },
      select: ["id", "password"],
    });
    const isSamePassword = await compareHashString(dto.password, user.password);
    if (!isSamePassword) {
      throw new BadRequestException(ValidationMessage.PASSWORD_NOT_MATCH);
    }
    const { access_token, refresh_token } = this.tokenService.generateAuthToken(
      { id: user.id },
      true,
    );
    await this.repo.saveRefreshToken(user, refresh_token);
    return { access_token, refresh_token };
  }

  async signUp(dto: CreateUserDto): Promise<any> {
    const user = await this.usersService.createOne(dto);
    user.password = dto.password;
    return this.signin(user);
  }

  async getMe(id: number): Promise<User> {
    return this.usersService.findOneOrFail(id);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    const identity = await this.repo.findOneOrFail({
      where: { refresh_token: dto.refresh_token },
      relations: ["user"],
      select: ["id", "refresh_token", "user"],
    });
    await this.tokenService.verifyAuthToken(
      dto.refresh_token,
      REFRESH_TOKEN_SECRET,
    );
    const { access_token, refresh_token } = this.tokenService.generateAuthToken(
      { id: identity.user.id },
      true,
    );
    await this.repo.updateTokenOrFail(dto.refresh_token, refresh_token);
    return { access_token, refresh_token };
  }

  async revokeToken(dto: RefreshTokenDTO) {
    return this.repo.updateTokenOrFail(dto.refresh_token, null);
  }
}
