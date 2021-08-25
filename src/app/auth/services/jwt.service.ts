import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
} from "@config/env";
import { ServerMessage } from "@core/constants/error-message";
import { ProjectLogger } from "@core/services/loggers/log-service";
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  /**
   * @Usage Generate JWT with the system secret and expires
   */
  generateAuthToken(payload: any, require_refresh_token = false) {
    let access_token: string = null;
    let refresh_token: string = null;

    access_token = this.jwtService.sign(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    if (require_refresh_token) {
      refresh_token = this.jwtService.sign(payload, {
        secret: REFRESH_TOKEN_SECRET,
        expiresIn: REFRESH_TOKEN_EXPIRES,
      });
    }
    return {
      access_token,
      refresh_token,
    };
  }

  /**
   * @Usage Verify JWT with the secret
   */
  async verifyAuthToken(token: string, secret: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret,
      });
    } catch (error) {
      if (error.message == "jwt expired") {
        throw new UnauthorizedException("Authentication info expired");
      }
      if (error.message == "invalid signature") {
        throw new UnauthorizedException("Authentication info incorrect");
      }
      ProjectLogger.log_exception(error.stack);
      throw new InternalServerErrorException(
        ServerMessage.UNKNOWN_SERVER_ERROR,
      );
    }
  }
}
