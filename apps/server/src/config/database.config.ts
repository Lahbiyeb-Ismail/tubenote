import { envConfig } from "@modules/shared";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma || new PrismaClient();

if (envConfig.node_env !== "production") globalThis.prisma = prismaClient;

export default prismaClient;
