import { Logger } from "@tubenote/logger";
import { injectable } from "inversify";

import type { ILoggerService } from "./logger.types";

@injectable()
export class LoggerService extends Logger implements ILoggerService {
}
