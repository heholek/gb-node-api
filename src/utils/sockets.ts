import config from "config";
import io from "socket.io";
import { IGb, model as Gb } from "../models/gb";
import { model as User } from "../models/user";

// Create a new socket server
export const server = io.listen(config.get("socketPort"));

// TODO update with topics subscibed from GB
// Addresses that are listend to in Socket.io for Gb data
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
  "number_of_satellites",
  "action"
];

/**
 * Server auth using username and password of Gb
 */
// TODO ensure that gbs can only loginto their specific id
server.use(async (socket, next) => {
  // Check if token is present in the query
  if (
    socket.handshake.query &&
    socket.handshake.query.role &&
    socket.handshake.query.password &&
    socket.handshake.query.username
  ) {
    // Check for the role type
    if (socket.handshake.query.role === "gb") {
      // Login as Gb
      // TODO probably repeat code, DRYify
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
      // TODO same thing as up there
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
  // Get all the gbs from the databse
  const gbs = await Gb.find({})
    .exec()
    .catch(err => {
      throw new Error(err);
    });

  // For each Gb, register the socke
  gbs.forEach(gb => {
    registerSocketsForGb(gb);
    console.log(gb._id + " socket initialized");
    Gb.findByIdAndUpdate(gb.id, gb);
  });
};

const registerSocketsForGb = (gb: IGb) => {
  // Create a new namespace server for the id
  const nsp = server
    .of(`/${gb._id}`)
    .on("connection", s => {
      // Once a new user is connected, listen for each topic i.e. /sesnor/front
      topicsToSubscribe.forEach(topic => {
        s.on(topic, message => {
          // On recieivng a message, emit globally for all users
          nsp.emit(topic, message);
          // ----FOR DEBUG-----
          // console.log("Message published on " + topic + ": ", message);
        });
      });
    })
    .on("error", (e: any) => {
      console.log(e);
    });
};
