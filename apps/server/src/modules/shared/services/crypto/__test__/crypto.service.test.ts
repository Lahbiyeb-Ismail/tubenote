import bcrypt from "bcryptjs";
import { CryptoService } from "../crypto.service";

// Mock bcrypt
jest.mock("bcryptjs");

describe("CryptoService", () => {
  let cryptoService: CryptoService;
  const mockPlainPassword = "test-password-123";
  const mockHashedPassword = "hashed-password-xyz";
  const mockSalt = "test-salt";

  beforeEach(() => {
    cryptoService = new CryptoService();
    jest.clearAllMocks();

    // Setup default mock implementations
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  describe("CryptoService - hashPassword method", () => {
    it("should successfully hash a valid password", async () => {
      const result = await cryptoService.hashPassword(mockPlainPassword);

      expect(result).toBe(mockHashedPassword);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPlainPassword, mockSalt);
    });

    it("should throw error when password is empty", async () => {
      await expect(cryptoService.hashPassword("")).rejects.toThrow(
        "Password is required for hashing."
      );
    });

    it("should throw error when password is undefined", async () => {
      await expect(
        cryptoService.hashPassword(undefined as any)
      ).rejects.toThrow("Password is required for hashing.");
    });

    it("should throw error when bcrypt.genSalt fails", async () => {
      const mockError = new Error("Salt generation failed");
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(mockError);

      await expect(
        cryptoService.hashPassword(mockPlainPassword)
      ).rejects.toThrow(mockError);
    });

    it("should throw error when bcrypt.hash fails", async () => {
      const mockError = new Error("Hashing failed");
      (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

      await expect(
        cryptoService.hashPassword(mockPlainPassword)
      ).rejects.toThrow(mockError);
    });
  });

  describe("CryptoService - comparePasswords method", () => {
    it("should return true when passwords match", async () => {
      const result = await cryptoService.comparePasswords({
        plainText: mockPlainPassword,
        hash: mockHashedPassword,
      });

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPlainPassword,
        mockHashedPassword
      );
    });

    it("should return false when passwords do not match", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await cryptoService.comparePasswords({
        plainText: mockPlainPassword,
        hash: mockHashedPassword,
      });

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPlainPassword,
        mockHashedPassword
      );
    });

    it("should throw error when password is empty", async () => {
      await expect(
        cryptoService.comparePasswords({
          plainText: "",
          hash: mockHashedPassword,
        })
      ).rejects.toThrow(
        "Both plainText and hashed passwords are required for comparison."
      );
    });

    it("should throw error when hashedPassword is empty", async () => {
      await expect(
        cryptoService.comparePasswords({
          plainText: mockPlainPassword,
          hash: "",
        })
      ).rejects.toThrow(
        "Both plainText and hashed passwords are required for comparison."
      );
    });

    it("should throw error when both parameters are empty", async () => {
      await expect(
        cryptoService.comparePasswords({
          plainText: "",
          hash: "",
        })
      ).rejects.toThrow(
        "Both plainText and hashed passwords are required for comparison."
      );
    });

    it("should throw error when bcrypt.compare fails", async () => {
      const mockError = new Error("Comparison failed");
      (bcrypt.compare as jest.Mock).mockRejectedValue(mockError);

      await expect(
        cryptoService.comparePasswords({
          plainText: mockPlainPassword,
          hash: mockHashedPassword,
        })
      ).rejects.toThrow(mockError);
    });
  });
});
