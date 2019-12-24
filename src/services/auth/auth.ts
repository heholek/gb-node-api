import * as jwt from "jwt-simple";
import moment from "moment";
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IUser, model as User } from "../../models/user";
import UserController from "../user/users";

class Auth {
  private static checkUsernamePassword(req: any): any {
    req.checkBody("username", "Invalid username").notEmpty();
    req.checkBody("password", "Invalid password").notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      return errors;
    }
    return false;
  }
  /**
   * Initialize passport strategy
   */
  public initialize = () => {
    passport.use("jwt", this.getStrategy());
    return passport.initialize();
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
      // Check for errors
      const errors = Auth.checkUsernamePassword(req);
      if (errors) {
        throw errors;
      }

      // Find user
      const user = await User.findOne({ username: req.body.username }).exec();

      // If no user is found, throw error
      if (user === null) {
        throw new Error("User not found");
      }

      // Compare password of users, if password doesn't match, throw error
      const success = await user.comparePassword(req.body.password);
      if (!success) {
        throw new Error("");
      }

      res.status(200).json(this.genToken(user));
    } catch (err) {
      res.status(401).json({ message: "Invalid credentials", errors: err });
    }
  };

  /**
   * Generate token for specific user
   * @param user User object
   */
  private genToken = (user: IUser): object => {
    const expires = moment()
      .utc()
      .add({ days: 7 })
      .unix();
    const token = jwt.encode(
      {
        exp: expires,
        username: user.username
      },
      process.env.JWT_SECRET || "afeaf@213feafeaf"
    );

    return {
      token: "JWT " + token,
      expires: moment.unix(expires).format(),
      user: user._id
    };
  };

  private getStrategy = (): Strategy => {
    const params = {
      secretOrKey: process.env.JWT_SECRET || "afeaf@213feafeaf",
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      passReqToCallback: true
    };

    return new Strategy(params, (req: any, payload: any, done: any) => {
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
    });
  };
}

export default new Auth();
