export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
