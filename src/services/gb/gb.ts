import { Request, Response } from "express";
import passport from "passport";
import { model as Gb } from "../../models/gb";
import { genToken, getStrategy } from "../../utils/authStrategy";

class Gbs {
  /* istanbul ignore next */
  public initialize = () => {
    passport.use("jwt", getStrategy(Gb, 2));
    return passport.initialize();
  };
  /* istanbul ignore next */
  public session = () => {
    return passport.session();
  };

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
        throw errors;
      }

      const gb = await Gb.findOne({ username: req.body.username }).exec();

      if (gb === null) {
        throw new Error();
      }

      const success = await gb.comparePassword(req.body.password);
      if (!success) {
        throw new Error("");
      }

      res.status(200).json(genToken(gb), gb.id);
    } catch (err) {
      res.status(401).json({ message: "Invalid credentials", errors: err });
    }
  };

  /**
   * Get all the users in an array
   * @param req
   * @param res
   */
  public getAll = async (req: Request, res: Response) => {
    try {
      const users = await Gb.find({}).exec();
      res.status(200).json(users);
    } catch (err) {
      /* istanbul ignore next */
      res.status(400).json(err);
    }
  };

  /**
   * Get a single user based on ID
   * @param req contains id of the user
   * @param res
   */
  public getOne = async (req: Request, res: Response) => {
    try {
      const user = await Gb.findById(req.params.id).exec();

      if (user === null) {
        return res.status(404).json({ message: "This user doesn't exist" });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  /**
   * Create a new Gb
   * @param req contains "username" and "password"
   * @param res
   * @returns User ID
   */
  public create = async (req: Request, res: Response) => {
    try {
      this.validateRequest(req);
      const Data = new Gb(req.body);
      Data.save()
        .then(value => {
          res
            .status(201)
            .json({ message: "Name saved successfully!", id: value._id });
        })
        .catch((err: any) => {
          if (err.code === 11000) {
            res.status(400).json({ message: `Error: Name Taken`, errors: err });
          } else {
            res
              .status(400)
              .json({ message: `Error: ${err.errmsg}`, errors: err });
          }
        });
    } catch (err) {
      res.status(400).json({ message: "Missing parameters", errors: err });
    }
  };

  /**
   * Updates user
   * @param req contains "username" and "password"
   * @param res
   */
  public update = async (req: Request, res: Response) => {
    let message = "Missing parameters";
    try {
      this.validateRequest(req, false);
      await Gb.findByIdAndUpdate(req.params.id, req.body)
        .catch(err => {
          message = "Error: Username Taken";
          throw new Error(err);
        })
        .then(() => {
          res.status(200).json({ message: "User updated successfully!" });
        });
    } catch (err) {
      res.status(400).json({ message, errors: err });
    }
  };

  /**
   * Deletes user
   * @param req contains "id" to delete
   * @param res
   */
  public delete = async (req: Request, res: Response) => {
    try {
      await Gb.findByIdAndRemove(req.params.id).catch(err => {
        throw new Error();
      });
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
      res.status(400).json({ message: `Error delete user: ${err}` });
    }
  };

  /**
   * Validates request to ensure that "username" and "password" fields aren't empty
   * @param req
   * @param update
   */
  private validateRequest = (req: any, update = false) => {
    if (!update) {
      req.checkBody("username", "The name cannot be empty").notEmpty();
      req.checkBody("password", "The password cannot be empty").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        throw errors;
      }
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error("Nothing was sent");
    }
  };
}

export default new Gbs();
