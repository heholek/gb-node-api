import config from "config";
import io from "socket.io";
import { model as Gb } from "../models/gb";

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
server.use(async (socket, next) => {
  // Check if token is present
  if (
    socket.handshake.query &&
    socket.handshake.query.password &&
    socket.handshake.query.username
  ) {
    const gb = await Gb.findOne({
      email: socket.handshake.query.username
    });
    if (gb === null) {
      next(new Error("User not found"));
    } else {
      const success = await gb.comparePassword(socket.handshake.query.password);
      if (!success) {
        next(new Error("Wrong password"));
      }
    }
    next();
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
    console.log(gb.username + " socket initialized");
    Gb.findByIdAndUpdate(gb.id, gb);
  });
};

const updateDatabaseWithSocketInformation = (gb: any) => {
  server.of(`/${gb.username}`).on("connection", s => {
    topicsToSubscribe.forEach(topic => {
      s.on(topic, message => {
        // console.log("Message published on " + topic + ": ", message);
      });
    });
  });
};
