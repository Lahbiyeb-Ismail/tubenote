import { loggerService } from "../logger";
import { PrismaService } from "./prisma.service";

export const prismaService = PrismaService.getInstance({
  maxRetries: 5,
  retryDelay: 1000,
  logger: loggerService,
});
