import type { ComparePasswordDto } from "./dtos/compare-password.dto";

export interface IPasswordHasherService {
  hashPassword(password: string): Promise<string>;
  comparePassword(comparePasswordDto: ComparePasswordDto): Promise<boolean>;
}
