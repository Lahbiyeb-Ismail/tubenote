import envConfig from '../config/envConfig';

import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  type Profile,
} from 'passport-google-oauth20';

//initialize
passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.google.client_id, // google client id
      clientSecret: envConfig.google.client_secret, // google client secret
      // the callback url added while creating the Google auth app on the console
      callbackURL: '/api/v1/auth/google/callback',
      passReqToCallback: true,
    },

    // returns the authenticated email profile
    async (_request, _accessToken, _refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// function to serialize a user/profile object into the session
passport.serializeUser((user, done) => {
  done(null, user as Profile);
});

// function to deserialize a user/profile object into the session
passport.deserializeUser((user, done) => {
  done(null, user as Profile);
});

export default passport;
