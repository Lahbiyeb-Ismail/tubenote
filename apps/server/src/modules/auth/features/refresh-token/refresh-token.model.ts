export interface RefreshToken {
  id: string;
  tokenHash: string;
  hint: string;
  userId: string;
  clientType: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  lastUsedAt: Date | null;
  isRevoked: boolean;
  revokedAt: Date | null;
  revocationReason: string | null;
}
