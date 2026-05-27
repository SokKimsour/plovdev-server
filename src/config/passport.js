const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../models'); // Path to your Sequelize models
const { generateUsername } = require('../utils/generateForUser');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      
      // 1. Check existing user first (Fast)
      const start = Date.now();
      let user = await Users.findOne({ where: { email } ,   attributes: ['id', 'role', 'google_id']  });
      console.log('DB lookup took:', Date.now() - start, 'ms');

      if (user) {
        if (!user.google_id) {
          await user.update({ google_id: profile.id, auth_provider: 'google' });
        }
        return done(null, user);
      }

      // 2. Only run this logic for NEW users (Saves time for returning users)
      const userName = await generateUsername(profile.displayName);
      
      user = await Users.create({
        fullName: profile.displayName,
        userName: userName,
        email: email,
        google_id: profile.id,
        auth_provider: 'google',
        password: null,
        is_verified: true,
        role: 'user'
      });

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// These are required for Passport to track the user session internally
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await Users.findByPk(id, {
  attributes: ['id', 'role', 'google_id'] // Skip fetching heavy columns like 'bio' or 'createdAt'
  });
  done(null, user);
});
