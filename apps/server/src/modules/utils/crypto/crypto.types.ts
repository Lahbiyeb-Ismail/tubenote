import type { ComparePasswordDto } from "./dtos/compare-password.dto";

export interface ICryptoService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(comparePasswordDto: ComparePasswordDto): Promise<boolean>;
  generateRandomSecureToken(): string;
  hashToken(token: string): Promise<string>;
}
