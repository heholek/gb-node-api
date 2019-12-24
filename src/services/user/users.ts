// @ts-ignore
import { Request, Response } from "express-validator";
import { model as User } from "../../models/user";

class Users {
  public getAll = async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).exec();
      res.status(200).json(users);
    } catch (err) {
      /* istanbul ignore next */
      res.status(400).json(err);
    }
  };

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

  public create = async (req: Request, res: Response) => {
    try {
      this.validateRequest(req);

      const Data = new User(req.body);
      console.log("Request made");
      await Data.save().catch(err => console.error(err));

      res
        .status(201)
        .json({ message: "User saved successfully!", id: Data._id });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Missing parameters", errors: err });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      this.validateRequest(req, true);

      await User.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json({ message: "User updated successfully!" });
    } catch (err) {
      res.status(400).json({ message: "Missing parameters", errors: err });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      await User.findByIdAndRemove(req.params.id);
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
      res.status(400).json({ message: `Error delete user: ${err}` });
    }
  };

  private validateRequest = (req: Request, update = false) => {
    if (!update) {
      req.checkBody("username", "The username cannot be empty").notEmpty();
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

export default new Users();
