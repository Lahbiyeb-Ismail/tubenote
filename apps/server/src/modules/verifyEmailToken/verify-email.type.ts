export interface VerificationTokenEntry {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
