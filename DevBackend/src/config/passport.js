const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config();
const User = require("../models/user");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:7777/googleauth"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ emailId: profile.emails[0].value });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName || '',
                emailId: profile.emails[0].value,
                photourl: profile.photos[0].value,
                isVerified: true
            });
        } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
