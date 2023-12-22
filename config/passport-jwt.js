const passport = require("passport");
const User = require("../models/userSchema");

const JWTStrategy = require("passport-jwt").Strategy;

const ExtractJWT = require("passport-jwt").ExtractJwt;

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};
passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    const user = User.findById({ id: jwt_payload._id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

module.exports = passport;
