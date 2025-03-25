import { loggerService } from "@/modules/shared/services";

import { JwtService } from "./jwt.service";

const jwtService = JwtService.getInstance({ loggerService });

export { jwtService };
