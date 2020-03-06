import { Request, Response } from "express";
import passport from "passport";
import { gbHelper } from "../../models/gb";
import { genTokenGb, getStrategy } from "../../utils/authStrategy";
import { initializeSockets } from "../../utils/sockets";

class Gbs {
  /* istanbul ignore next */
  public initialize = () => {
    passport.use("jwt", getStrategy(gbHelper.model, 2));
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

      const gb = await gbHelper.model
        .findOne({ username: req.body.username })
        .exec();

      if (gb === null) {
        throw new Error();
      }

      const success = await gb.comparePassword(req.body.password);
      if (!success) {
        throw new Error("");
      }

      res.status(200).json(genTokenGb(gb), gb.id);
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
      const gbs = await gbHelper.getAll();
      const safeGbs = gbs.map((gb: any) => {
        this.mapUserToDto(gb);
      });
      res.status(200).json(safeGbs);
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
      const user = await gbHelper.findById(req.params.id);

      if (user === null) {
        return res.status(404).json({ message: "This user doesn't exist" });
      }

      res.status(200).json(this.mapUserToDto(user));
      /* istanbul ignore next */
    } catch (err) {
      /* istanbul ignore next */
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
      gbHelper
        .createOne(req.body)
        .then(value => {
          res
            .status(201)
            .json({ message: "Name saved successfully!", id: value._id });
        })
        .catch((err: any) => {
          // console.log(err);
          if (err.code === 11000) {
            res.status(400).json({ message: `Error: Name Taken`, errors: err });
          } else {
            /* istanbul ignore next */
            res
              .status(400)
              .json({ message: `Error: ${err.errmsg}`, errors: err });
          }
        });
    } catch (err) {
      res.status(400).json({ message: "Missing parameters", errors: err });
    }
    initializeSockets().then();
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
      await gbHelper
        .edit(req.params.id, this.mapDtoToUser(req.body))
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
    initializeSockets().then();
  };

  /**
   * Deletes user
   * @param req contains "id" to delete
   * @param res
   */
  public delete = async (req: Request, res: Response) => {
    try {
      await gbHelper.delete(req.params.id).catch(err => {
        throw new Error();
      });
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
      res.status(400).json({ message: `Error delete user: ${err}` });
    }
    initializeSockets().then();
  };

  /**
   * Validates request to ensure that "username" and "password" fields aren't empty
   * @param req
   * @param update
   */
  private validateRequest = (req: any, update = false) => {
    /* istanbul ignore next */
    if (!update) {
      req.checkBody("username", "The name cannot be empty").notEmpty();
      req.checkBody("password", "The password cannot be empty").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        throw errors;
      }
    }
    /* istanbul ignore next */
    if (Object.keys(req.body).length === 0) {
      /* istanbul ignore next */
      throw new Error("Nothing was sent");
    }
  };

  /**
   * Maps user object ot something that's safe to return
   * @param gb
   * @returns {*}
   */
  private mapUserToDto(gb: any) {
    return gb
      ? {
          _id: gb._id,
          username: gb.username,
          color: gb.color, // color of gb on map (red, blue, etc.)
          statusCode: gb.statusCode, // Last known status of Gb
          location: gb.location, // Current location
          createdAt: gb.createdAt, // When Created
          updatedAt: gb.updatedAt, // When updated
          version: gb.version, // Software version of dto
          videoLink: gb.videoLink, // Link to rtsp video stream
          ip: gb.ip // Ip of the garbage byte
        }
      : {};
  }

  private mapDtoToUser(dto: any) {
    return dto
      ? {
          _id: dto._id,
          username: dto.username,
          color: dto.color, // color of dto on map (red, blue, etc.)
          statusCode: dto.statusCode, // Last known status of dto
          location: dto.location, // Current location
          createdAt: dto.createdAt, // When Created
          updatedAt: dto.updatedAt, // When updated
          version: dto.version, // Software version of dto
          videoLink: dto.videoLink, // Link to rtsp video stream
          ip: dto.ip // Ip of the garbage byte
        }
      : {};
  }
}

export default new Gbs();
