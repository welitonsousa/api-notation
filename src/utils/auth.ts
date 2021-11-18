import { getRepository } from "typeorm";
import { User } from '../models/modelUser';
import * as passportJWT from "passport-jwt";
const passport = require('passport');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const auth = () => {
  const strategy = new Strategy(params, async (payload, done) => {    
    const repository = getRepository(User);

    const user = await repository.findOne(payload.id);
    const validSign = new Date(user.valid_sign)
    
    const date = new Date(payload.date);
    if (date < validSign) {
      return done(new Error("token expirado"), null);
    }

    if (user) return done(null, { id: user.id });
    return done(new Error("User not found"), null);
  });
  passport.use(strategy);
  return {
    initialize: () => passport.initialize(),
    authenticate: (cb?) => passport.authenticate("jwt", { session: process.env.SESSION == "true" }, cb)
  };
};

export { auth }