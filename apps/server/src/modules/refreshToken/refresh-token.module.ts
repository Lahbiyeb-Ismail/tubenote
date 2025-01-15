import prismaClient from "../../config/database.config";
import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshTokenService } from "./refresh-token.service";

const refreshTokenRepository = new RefreshTokenRepository(prismaClient);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

export { refreshTokenService };
