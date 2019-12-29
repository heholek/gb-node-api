import config from "config";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
const jwt = require("jwt-simple");

const secret = config.get("secret");

export const getStrategy = (db: any, mode: number): Strategy => {
  let params: object;
  if (mode === 1) {
    params = {
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      passReqToCallback: true
    };
  } else {
    params = {
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromHeader("gb_auth"),
      passReqToCallback: true
    };
  }

  return new Strategy(
    params as StrategyOptions,
    (req: any, payload: any, done: any) => {
      db.findOne({ username: payload.username }, (err: any, user: any) => {
        /* istanbul ignore next: passport response */
        if (err) {
          return done(err);
        }
        /* istanbul ignore next: passport response */
        if (user === null) {
          return done(null, false, {
            message: "The user in the token was not found"
          });
        }

        return done(null, { _id: user._id, username: user.username });
      });
    }
  );
};

export const genToken = (schema: any): object => {
  const token = jwt.encode(
    {
      username: schema.username
    },
    secret
  );

  return {
    token: "JWT " + token,
    user: schema._id
  };
};
