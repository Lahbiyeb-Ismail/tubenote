import { cacheService } from "../cache";
import { loggerService } from "../logger";

import { RateLimitService } from "./rate-limit.service";

export const rateLimitService = RateLimitService.getInstance({
  cacheService,
  logger: loggerService,
});
