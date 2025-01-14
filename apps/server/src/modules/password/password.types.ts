import type { UserDto } from "../user/dtos/user.dto";
import type { ComparePasswordsDto } from "./dtos/compare-passwords.dto";
import type { ResetPasswordDto } from "./dtos/reset-password.dto";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(comparePasswordsDto: ComparePasswordsDto): Promise<boolean>;
  updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserDto>;
  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<UserDto>;
}
