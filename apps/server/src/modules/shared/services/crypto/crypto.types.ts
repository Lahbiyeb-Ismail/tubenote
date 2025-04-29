import type { HashValidationDto } from "./dtos";

export interface ICryptoService {
  generateHash(rawValue: string): Promise<string>;
  validateHashMatch(hashValidationDto: HashValidationDto): Promise<boolean>;
  generateSecureToken(): string;
}
