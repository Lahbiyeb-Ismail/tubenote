import verificationTokenDatabase from "../databases/verificationTokenDatabase";

class VerificationTokenService {
  async createEmailVericationToken(userId: string): Promise<string> {
    const token =
      await verificationTokenDatabase.createVerificationToken(userId);

    return token;
  }
}

export default new VerificationTokenService();
