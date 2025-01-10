export interface VerifyEmailTokenDto {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
