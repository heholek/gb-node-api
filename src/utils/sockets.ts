import config from "config";
import io from "socket.io";
import { IGb, model as Gb } from "../models/gb";
import { model as User } from "../models/user";

export const server = io.listen(config.get("socketPort"));
const topicsToSubscribe = [
  "test",
  "rwheel_encoder",
  "lwheel_encoder",
  "distance_front",
  "distance_rear",
  "distance_right",
  "distance_left",
  "distance_bottom",
  "position",
  "speed",
  "angle",
  "number_of_satellites"
];

/**
 * Server auth using username and password of Gb
 */
// TODO ensure that gbs can only loginto their specific id
server.use(async (socket, next) => {
  // Check if token is present
  if (
    socket.handshake.query &&
    socket.handshake.query.role &&
    socket.handshake.query.password &&
    socket.handshake.query.username
  ) {
    if (socket.handshake.query.role === "gb") {
      try {
        const gb = await Gb.findOne({
          username: socket.handshake.query.username
        });
        if (gb !== null) {
          const success = await gb.comparePassword(
            socket.handshake.query.password
          );
          if (!success) {
            next(new Error("Wrong password"));
          }
          next();
        } else {
          next(new Error("Gb not found"));
        }
      } catch (e) {
        next(e);
      }
    }
    if (socket.handshake.query.roll === "user") {
      try {
        const user = await User.findOne({
          email: socket.handshake.query.email
        });
        if (user !== null) {
          const success = await user.comparePassword(
            socket.handshake.query.password
          );
          if (!success) {
            next(new Error("Wrong password"));
          }
          next();
        } else {
          next(new Error("User not found"));
        }
      } catch (e) {
        next(e);
      }
    }
  } else {
    next(new Error("Authentication Error"));
  }
});

/**
 * Initialize sockets for all gbs in database
 */
export const initializeSockets = async (): Promise<any> => {
  const gbs = await Gb.find({})
    .exec()
    .catch(err => {
      throw new Error(err);
    });

  gbs.forEach(gb => {
    updateDatabaseWithSocketInformation(gb);
    console.log(gb._id + " socket initialized");
    Gb.findByIdAndUpdate(gb.id, gb);
  });
};

const updateDatabaseWithSocketInformation = (gb: IGb) => {
  const nsp = server
    .of(`/${gb._id}`)
    .on("connection", s => {
      topicsToSubscribe.forEach(topic => {
        s.on(topic, message => {
          nsp.emit(topic, message);
          console.log("Message published on " + topic + ": ", message);
        });
      });
    })
    .on("error", (e: any) => {
      console.log(e);
    });
};
