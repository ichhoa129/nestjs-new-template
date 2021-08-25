import { ServerMessage } from "@core/constants/error-message";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { ProjectLogger } from "./loggers/log-service";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    if (exception instanceof HttpException) {
      return this.handleHTTPException(exception, host);
    }
    return this.handleSystemException(exception, host);
  }

  /**
   * HttpException error handler. Recommended for customized error message.
   */
  private handleHTTPException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();
    const customResponse: any = exception.getResponse();
    const threatCode = [500, 501, 502, 503, 504, 505, 506, 507, 508, 509];
    const message =
      customResponse.message ||
      response.message ||
      ServerMessage.UNKNOWN_SERVER_ERROR;

    if (threatCode.includes(statusCode))
      ProjectLogger.log_exception(exception.stack);

    return response.status(exception.getStatus()).json({
      statusCode,
      message,
    });
  }

  /**
   * System exception error handler. This will throw out generic messages if invoked.
   */
  private handleSystemException(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let message = exception.message;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    switch (exception.constructor) {
      case EntityNotFoundError:
        statusCode = HttpStatus.NOT_FOUND;
        message = ServerMessage.NOT_FOUND;
        break;
      case QueryFailedError:
        statusCode = HttpStatus.BAD_REQUEST;
        message = ServerMessage.QUERY_ERROR;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = ServerMessage.UNKNOWN_SERVER_ERROR;
        break;
    }
    ProjectLogger.log_exception(exception.stack);

    return response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
