import type winston from "winston";

export interface LoggerConfig {
  level?: string;
  errorLogPath?: string;
  combinedLogPath?: string;
}

export interface LogLevels {
  error: number;
  warn: number;
  info: number;
  http: number;
  debug: number;
}

export interface LogColors {
  error: string;
  warn: string;
  info: string;
  http: string;
  debug: string;
}

export interface ILoggerService {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  http: LogMethod;
  debug: LogMethod;
}

export type LoggerTransport = winston.transport;

export type LogMethod = (message: string, meta?: any) => void;
