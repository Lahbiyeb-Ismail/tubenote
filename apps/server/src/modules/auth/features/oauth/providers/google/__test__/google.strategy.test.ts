import type { Profile } from "passport-google-oauth20";

import { GoogleOAuthStrategy } from "../google.strategy";

import type { IOauthLoginDto } from "../../../dtos";
import type { GoogleConfig } from "../google.types";

describe("GoogleOAuthStrategy", () => {
  const validConfig: GoogleConfig = {
    clientID: "testClientID",
    clientSecret: "testClientSecret",
    callbackURL: "http://localhost/callback",
  };

  const profile: Profile = {
    id: "google-id-123",
    provider: "google",
    displayName: "Test User",
    profileUrl: "http://example.com/profile",
    name: { familyName: "User", givenName: "Test" },
    emails: [{ value: "testuser@example.com", verified: true }],
    photos: [{ value: "http://example.com/photo.png" }],
    _raw: "",
    _json: {
      sub: "google-id-123",
      aud: "test-audience",
      exp: 1234567890,
      iat: 1234567890,
      iss: "https://accounts.google.com",
    },
  };

  let instance: GoogleOAuthStrategy;
  let done: jest.Mock;

  // Extract the private validate function via bracket notation.
  // (TypeScript doesn't allow direct access, so we cast to any.)
  let validateFn: (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: IOauthLoginDto) => Promise<void>
  ) => Promise<void>;

  beforeEach(() => {
    // Obtain the singleton instance
    instance = GoogleOAuthStrategy.getInstance(validConfig);

    done = jest.fn();
    // Access the bound validate function.
    validateFn = (instance as any).validate;
  });

  describe("Singleton Behavior", () => {
    it("should always return the same instance (singleton)", () => {
      const instance2 = GoogleOAuthStrategy.getInstance(validConfig);
      expect(instance).toBe(instance2);
    });

    it("getStrategy should return a GoogleStrategy instance", () => {
      const strategy = instance.getStrategy();
      expect(strategy).toBeDefined();
      // Verify that the strategy's name is 'google' (as expected by passport-google-oauth20)
      expect(strategy.name).toBe("google");
    });
  });

  describe("validate method", () => {
    it("should call done with user object when valid profile is provided", async () => {
      await validateFn("accessToken", "refreshToken", profile, done);

      // Assert: verify done is called with no error and a user object that matches expected shape.
      expect(done).toHaveBeenCalledWith(null, {
        createAccountDto: {
          type: "oauth",
          provider: "google",
          providerAccountId: profile.id,
        },
        createUserDto: {
          email: "testuser@example.com",
          profilePicture: "http://example.com/photo.png",
          username: "Test User",
          password: profile.id,
          isEmailVerified: true,
        },
      });
    });

    it("should call done with error if email is missing", async () => {
      const inValidProfile: Profile = {
        ...profile,
        emails: [], // No email provided
      };

      await validateFn("accessToken", "refreshToken", inValidProfile, done);

      // The callback should be called with an error.
      expect(done).toHaveBeenCalled();
      const error = done.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
    });
  });
});
