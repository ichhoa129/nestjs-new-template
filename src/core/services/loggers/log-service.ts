import { SYSTEM_LOG_INFO } from "@config/env";
import { LoggerFactory } from "./factory";

/**
 * Logger service, use this class to log something in your project
 */
export class ProjectLogger {
  static log_exception(message: string) {
    LoggerFactory.getInstance(SYSTEM_LOG_INFO).log("error", message);
  }

  static log_info(message: string) {
    LoggerFactory.getInstance(SYSTEM_LOG_INFO).log("info", message);
  }

  static log_warning(message: string) {
    LoggerFactory.getInstance(SYSTEM_LOG_INFO).log("warn", message);
  }
}
