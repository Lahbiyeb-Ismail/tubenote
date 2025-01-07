import bcrypt from "bcryptjs";

import type { ComparePasswordsDto } from "./dtos/compare-passwords.dto";

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(comparePasswordsDto: ComparePasswordsDto): Promise<boolean>;
}

export class PasswordService implements IPasswordService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    comparePasswordsDto: ComparePasswordsDto
  ): Promise<boolean> {
    const { password, hashedPassword } = comparePasswordsDto;
    return await bcrypt.compare(password, hashedPassword);
  }
}
