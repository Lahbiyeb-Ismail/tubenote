import type { LogMethod } from "@tubenote/logger";

import { Logger } from "@tubenote/logger";
import { injectable } from "inversify";

import type { ILoggerService } from "./logger.types";

@injectable()
export class LoggerService implements ILoggerService {
  private logger: ILoggerService;

  constructor() {
    // Create logger instance
    this.logger = new Logger();
  }

  // Log methods
  public error: LogMethod = (message: string, meta?: any) => {
    this.logger.error(message, meta);
  };

  public warn: LogMethod = (message: string, meta?: any) => {
    this.logger.warn(message, meta);
  };

  public info: LogMethod = (message: string, meta?: any) => {
    this.logger.info(message, meta);
  };

  public http: LogMethod = (message: string, meta?: any) => {
    this.logger.http(message, meta);
  };

  public debug: LogMethod = (message: string, meta?: any) => {
    this.logger.debug(message, meta);
  };

  // Utility methods
  // public getLogger(): winston.Logger {
  //   return this.logger;
  // }

  // public addTransport(transport: winston.transport): void {
  //   this.logger.add(transport);
  // }

  // public clearTransports(): void {
  //   this.logger.clear();
  // }
}
