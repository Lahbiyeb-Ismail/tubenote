import { loggerService } from "@/modules/shared";
import { JwtService } from "./jwt.service";

const jwtService = new JwtService(loggerService);

export { jwtService };
