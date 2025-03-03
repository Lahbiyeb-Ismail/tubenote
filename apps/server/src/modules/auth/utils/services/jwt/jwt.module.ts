import { loggerService } from "@/modules/shared/services";

import { JwtService } from "./jwt.service";

const jwtService = new JwtService(loggerService);

export { jwtService };
