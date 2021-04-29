import { getRepository } from "typeorm";
import { User } from '../models/modelUser';
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

function auth() {
  const strategy = new Strategy(params, async function(payload, done) {
    const repository = getRepository(User);
    const user = await repository.findOne(payload.id);
    if (user) {
      return done(null, {id: user.id});
    } else {
      return done(new Error("User not found"), null);
    }
  });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", process.env.SESSION == "true");
    }
  };
};

export { auth }