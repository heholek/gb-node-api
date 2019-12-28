import config from "config";
import express from "express";
import http from "http";

import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import { IUser } from "./models/user";
import routes from "./services";
import auth from "./services/auth/auth";
import { applyMiddleware, applyRoutes } from "./utils";
require("./db/baseRepository");

// Error Handling
/* istanbul ignore next */
process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});
/* istanbul ignore next */
process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

const router = express();

// TODO MOVE TO MIDDLEWARE FUNCTION
// Initializes auth
router.use(auth.initialize());
router.use(auth.session());

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
