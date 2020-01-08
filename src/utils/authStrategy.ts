import config from "config";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
const jwt = require("jwt-simple");

const secret = config.get("secret");

// Take out "Bearer"
const getAuthToken = (request: any) => {
  let token = null;
  if (request.headers.authorization) {
    token = request.headers.authorization.slice(7);
  }
  return token;
};

export const getStrategy = (db: any, mode: number): Strategy => {
  let params: object;
  if (mode === 1) {
    params = {
      secretOrKey: secret,
      jwtFromRequest: getAuthToken,
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

        return done(null, { _id: user._id, email: user.username });
      });
    }
  );
};

export const genToken = (schema: any): object => {
  const token = jwt.encode(
    {
      email: schema.username
    },
    secret
  );

  return {
    token,
    user: schema
  };
};

export const genTokenGb = (schema: any): object => {
  const token = jwt.encode(
    {
      email: schema.username
    },
    secret
  );

  return {
    token,
    gb: schema
  };
};
