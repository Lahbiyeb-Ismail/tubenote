import { userRepository } from "../user/user.module";
import { PasswordService } from "./password.service";

const passwordService = new PasswordService(userRepository);

export { passwordService };
