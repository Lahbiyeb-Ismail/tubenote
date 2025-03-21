import winston from "winston";

import type { ILoggerService, LogMethod, LoggerConfig } from "./logger.types";

import {
  DEFAULT_COMBINED_LOG_PATH,
  DEFAULT_ERROR_LOG_PATH,
  DEFAULT_LOG_LEVEL,
  DEFAULT_TIMESTAMP_FORMAT,
  LOG_COLORS,
  LOG_LEVELS,
} from "./logger.constants";

export class LoggerService implements ILoggerService {
  private static _instance: LoggerService;

  private logger: winston.Logger;

  constructor(config: LoggerConfig = {}) {
    const {
      level = DEFAULT_LOG_LEVEL,
      errorLogPath = DEFAULT_ERROR_LOG_PATH,
      combinedLogPath = DEFAULT_COMBINED_LOG_PATH,
    } = config;

    // Add colors to winston
    winston.addColors(LOG_COLORS);

    // Create formats
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: DEFAULT_TIMESTAMP_FORMAT }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
      )
    );

    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: DEFAULT_TIMESTAMP_FORMAT }),
      winston.format.printf(
        (info) =>
          `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
      )
    );

    // Create logger instance
    this.logger = winston.createLogger({
      level,
      levels: LOG_LEVELS,
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        new winston.transports.File({
          filename: errorLogPath,
          level: "error",
          format: fileFormat,
        }),
        new winston.transports.File({
          filename: combinedLogPath,
          format: fileFormat,
        }),
      ],
    });
  }

  static getInstance(config?: LoggerConfig): LoggerService {
    if (!this._instance) {
      this._instance = new LoggerService(config);
    }
    return this._instance;
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
  public getLogger(): winston.Logger {
    return this.logger;
  }

  public addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  public clearTransports(): void {
    this.logger.clear();
  }
}
