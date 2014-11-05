var passport = require('passport');
//var FacebookStrategy = require('passport-facebook').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;

exports.setup = function (User, config) {
  passport.use(new InstagramStrategy({
      clientID: config.instagram.clientID,
      clientSecret: config.instagram.clientSecret,
      callbackURL: config.instagram.callbackURL
    },
  // passport.use(new FacebookStrategy({
  //     clientID: config.facebook.clientID,
  //     clientSecret: config.facebook.clientSecret,
  //     callbackURL: config.facebook.callbackURL
  //   },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'instagram.id': profile.id
        //'facebook.id': profile.id
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            //email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'instagram',
            instagram: profile._json,
            accessToken: accessToken
            // provider: 'facebook',
            // facebook: profile._json
          });
          user.save(function(err) {
            if (err) done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      })
    }
  ));
};