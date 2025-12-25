const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const logger = require('../utils/logger');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'pricing-automation-api',
  audience: 'pricing-automation-client',
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.userId)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return done(null, false);
    }

    if (!user.isActive) {
      return done(null, false, { message: 'Account is deactivated' });
    }

    // Add additional user info to request
    const userInfo = {
      ...user,
      permissions: user.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
      features: ['pricing', 'analytics', 'sharing']
    };

    return done(null, userInfo);
  } catch (error) {
    logger.error(`JWT Strategy error: ${error.message}`);
    return done(error, false);
  }
}));

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'photos'],
    enableProof: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        $or: [
          { facebookId: profile.id },
          { email: profile.emails?.[0]?.value }
        ]
      });

      if (!user) {
        // Create new user
        user = new User({
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          facebookId: profile.id,
          avatar: profile.photos?.[0]?.value,
          isEmailVerified: true,
          authProvider: 'facebook',
          socialProfiles: {
            facebook: {
              id: profile.id,
              accessToken: accessToken,
              profileUrl: `https://facebook.com/${profile.id}`
            }
          }
        });
      } else {
        // Update existing user
        user.facebookId = profile.id;
        user.socialProfiles.facebook = {
          id: profile.id,
          accessToken: accessToken,
          profileUrl: `https://facebook.com/${profile.id}`
        };
      }

      await user.save();
      done(null, user);
    } catch (error) {
      logger.error(`Facebook Strategy error: ${error.message}`);
      done(error, null);
    }
  }));
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        $or: [
          { googleId: profile.id },
          { email: profile.emails?.[0]?.value }
        ]
      });

      if (!user) {
        user = new User({
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value,
          isEmailVerified: true,
          authProvider: 'google'
        });
      } else {
        user.googleId = profile.id;
        user.avatar = profile.photos?.[0]?.value;
      }

      await user.save();
      done(null, user);
    } catch (error) {
      logger.error(`Google Strategy error: ${error.message}`);
      done(error, null);
    }
  }));
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;