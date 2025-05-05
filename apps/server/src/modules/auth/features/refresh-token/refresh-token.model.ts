export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  clientType: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  lastUsedAt: Date | null;
  isRevoked: boolean;
  revokedAt: Date | null;
  revocationReason: string | null;
}
