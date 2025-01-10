import envConfig from "../config/envConfig";

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
} from "passport-google-oauth20";
import type { GoogleUser } from "../modules/auth/auth.type";

//initialize
passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.google.client_id, // google client id
      clientSecret: envConfig.google.client_secret, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: "/api/v1/auth/google/callback",
      passReqToCallback: true,
    },

    // returns the authenticated email profile
    async (_request, _accessToken, _refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// function to serialize a user/profile object into the session
passport.serializeUser((profile, done) => {
  done(null, profile);
});

// function to deserialize a user/profile object into the session
passport.deserializeUser((profile: Profile, done) => {
  done(null, profile);
});

export default passport;
