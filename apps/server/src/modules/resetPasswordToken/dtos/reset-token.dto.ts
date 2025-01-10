export interface ResetTokenDto {
  token: string;
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
