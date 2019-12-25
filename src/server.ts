import config from "config";
import express from "express";
import http from "http";

import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import { IUser } from "./models/user";
import routes from "./services";
import auth from "./services/auth/auth";
import { applyMiddleware, applyRoutes } from "./utils";
const db = require("./db/baseRepository");

// Error Handling
process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});
process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

const router = express();

// TODO MOVE TO MIDDLEWARE FUNCTION
// Initializes auth
router.use(auth.initialize());
router.use(auth.session());

/**
 * Checks for auth token on all routes except login and register
 */
router.all("*", (req, res, next) => {
  if (req.path.includes("login") || req.path.includes("register")) {
    return next();
  }

  return auth.authenticate((err: Error, user: IUser, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Checks for expired token
      if (info.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your token has expired. Please generate a new one"
        });
      } else {
        return res.status(401).json({ message: info.message });
      }
    }
    router.set("user", user);
    return next();
  })(req, res, next);
});

// Apply all middleware to function
applyMiddleware(middleware, router);

// Apply routes
applyRoutes(routes, router);

// Apply error handlers
applyMiddleware(errorHandlers, router);

// tslint:disable-next-line:no-bitwise
const port = Number(config.get("port")) | 3000;
const server = http.createServer(router);

// Listen on port
server.listen(port, () =>
  console.log(`Server is running http://localhost:${port}...`)
);

module.exports = server;
