import verificationTokenDatabase from "../databases/verificationTokenDatabase";

class VerificationTokenService {
  async createToken(userId: string): Promise<string> {
    const token = await verificationTokenDatabase.create(userId);

    return token;
  }
}

export default new VerificationTokenService();
