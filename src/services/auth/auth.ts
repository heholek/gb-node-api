const jwt = require("jwt-simple");
import config from "config";
import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { IUser, model as User } from "../../models/user";

const secret = config.get("secret");

class Auth {
  /**
   * Initialize passport strategy
   */
  public initialize = () => {
    passport.use("jwt", this.getStrategy());
    return passport.initialize();
  };

  public session = () => {
    return passport.session();
  };

  public authenticate = (callback: any) =>
    passport.authenticate(
      "jwt",
      { session: false, failWithError: true },
      callback
    );

  /**
   * User login
   * @param req
   * @param res
   */
  public login = async (req: any, res: any) => {
    try {
      req.checkBody("username", "Invalid username").notEmpty();
      req.checkBody("password", "Invalid password").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        console.error(errors);
        throw errors;
      }

      const user = await User.findOne({ username: req.body.username }).exec();

      if (user === null) {
        throw new Error("User not found");
      }

      const success = await user.comparePassword(req.body.password);
      if (!success) {
        throw new Error("");
      }

      res.status(200).json(this.genToken(user), user.id);
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Invalid credentials", errors: err });
    }
  };

  /**
   * Generate token for specific user
   * @param user User object
   */
  private genToken = (user: IUser): object => {
    const token = jwt.encode(
      {
        username: user.username
      },
      secret
    );

    return {
      token: "JWT " + token,
      user: user._id
    };
  };

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      passReqToCallback: true
    };

    return new Strategy(
      params as StrategyOptions,
      (req: any, payload: any, done: any) => {
        User.findOne({ username: payload.username }, (err, user) => {
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
}

export default new Auth();
