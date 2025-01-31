import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile } from "passport-google-oauth20";

import type { IUserService } from "@modules/user/user.types";

export interface GoogleConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export class GoogleAuthStrategy {
  private strategy: GoogleStrategy;
  private userService: IUserService;

  constructor(config: GoogleConfig, userService: IUserService) {
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

    this.userService = userService;
  }

  private async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) {
    try {
      const { id, emails, displayName, photos } = profile;
      const email = emails?.[0].value;
      const profilePicture = photos?.[0].value;

      if (!email) {
        return done(new Error("No email provided from Google"));
      }

      const user = await this.userService.getOrCreateUser({
        email,
        profilePicture,
        username: displayName,
        password: id,
        googleId: id,
        isEmailVerified: true,
      });

      if (!user) {
        return done(new Error("Failed to create user from Google profile"));
      }

      user.password = "";

      done(null, user);
    } catch (error) {
      done(error);
    }
  }

  getStrategy() {
    return this.strategy;
  }
}
