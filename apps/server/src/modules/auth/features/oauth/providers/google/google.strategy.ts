import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile } from "passport-google-oauth20";

import type { IOauthLoginDto } from "../../dtos";
import type { GoogleConfig } from "./google.types";

export class GoogleOAuthStrategy {
  private static _instance: GoogleOAuthStrategy;
  private strategy: GoogleStrategy;

  // Private constructor to prevent direct instantiation.
  private constructor(config: GoogleConfig) {
    this.strategy = new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        state: true,
        scope: ["profile", "email"],
      },
      this.validate.bind(this)
    );
  }

  // Public static method to get the single instance.
  public static getInstance(config: GoogleConfig): GoogleOAuthStrategy {
    if (!this._instance) {
      this._instance = new GoogleOAuthStrategy(config);
    }
    return this._instance;
  }

  private async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, user?: IOauthLoginDto) => void
  ) {
    try {
      const { id, emails, displayName, photos } = profile;
      const email = emails?.[0].value;
      const profilePicture = photos?.[0].value || null;

      if (!email) {
        return done(new Error("No email provided from Google"));
      }

      const user: IOauthLoginDto = {
        createAccountDto: {
          data: {
            type: "oauth",
            provider: "google",
            providerAccountId: id,
          },
        },
        createUserDto: {
          data: {
            email,
            profilePicture,
            username: displayName,
            password: id,
            isEmailVerified: true,
          },
        },
      };

      done(null, user);
    } catch (error) {
      done(error);
    }
  }

  public getStrategy() {
    return this.strategy;
  }
}
