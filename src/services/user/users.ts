import { Request, Response } from "express";
import mongoose from "mongoose";
import { model as Gb } from "../../models/gb";
import { model as User } from "../../models/user";

class Users {
  /**
   * Get all of the users gbs
   * @param req - req.params.id is the user id
   * @param res
   */
  public getOwnedGbs = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id).exec();
      if (user === null) {
        return res.status(404).json({ message: "This user doesn't exist" });
      }
      if (user) {
        // Map ids to object ids
        const ids = user.ownedGbs.map(v => new mongoose.Types.ObjectId(v));
        // Query database for array of ids
        const records = await Gb.find()
          .where("_id")
          .in(ids)
          .exec();
        // Return
        res.status(200).json(records);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  };
  /**
   * Get all the users in an array
   * @param req
   * @param res
   */
  public getAll = async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).exec();
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
      const user = await User.findById(req.params.id).exec();

      if (user === null) {
        return res.status(404).json({ message: "This user doesn't exist" });
      }

      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  /**
   * Create a new user
   * @param req contains "username" and "password"
   * @param res
   * @returns User ID
   */
  public create = async (req: Request, res: Response) => {
    try {
      this.validateRequest(req);
      const Data = new User(req.body);
      Data.save()
        .then(value => {
          res
            .status(201)
            .json({ message: "User saved successfully!", id: value._id });
        })
        .catch((err: any) => {
          if (err.code === 11000) {
            res
              .status(400)
              .json({ message: `Error: Email Taken`, errors: err });
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
    try {
      this.validateRequest(req, true);
      await User.findByIdAndUpdate(req.params.id, req.body)
        .catch(err => {
          res
            .status(400)
            .json({ message: "Error: Username Taken", errors: err });
        })
        .then(value => {
          res.status(200).json({ message: "User updated successfully!" });
        });
    } catch (err) {
      res.status(400).json({ message: "Missing parameters", errors: err });
    }
  };

  /**
   * Deletes user
   * @param req contains "id" to delete
   * @param res
   */
  public delete = async (req: Request, res: Response) => {
    try {
      await User.findByIdAndRemove(req.params.id);
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
      req.checkBody("email", "The email cannot be empty").notEmpty();
      req.checkBody("password", "The password cannot be empty").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        throw errors;
      }
    }
  };
}

export default new Users();
