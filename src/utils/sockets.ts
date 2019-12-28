import io from "socket.io";
import { IUser, model as User } from "../models/user";

export const server = io.listen(8000);

server.use(async (socket, next) => {
  // Check if token is present
  if (
    socket.handshake.query &&
    socket.handshake.query.password &&
    socket.handshake.query.username
  ) {
    const user = await User.findOne({
      username: socket.handshake.query.username
    }).exec();
    if (!user) {
      next(new Error("User not found"));
    }
    // @ts-ignore
    const success = await user.comparePassword(socket.handshake.query.password);
    if (!success) {
      next(new Error("Wrong password"));
    }
    next();
  } else {
    next(new Error("Authentication Error"));
  }
});

// List of GB servers
server.of("/gb1");
