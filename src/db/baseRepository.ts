/**
 * Handles connection to mongo database
 */
import config from "config";
const mongoose = require("mongoose");
(mongoose as any).Promise = require("bluebird");
let dbName = "";

// Based on node environment, choose collection name
switch (process.env.DB_NAME) {
  case "PROD":
    dbName = "prod";
    break;
  case "DEV":
    dbName = "dev";
    break;
  default:
    dbName = "test";
    break;
}

const dbAddress = config.get("db.address");
const dbPort = config.get("db.port");

// Connect to mongo
mongoose
  .connect(`mongodb://${dbAddress}:${dbPort}/${dbName}`)
  .catch((err: Error) => {
    if (err.message.indexOf("ECONNREFUSED") !== -1) {
      console.error(
        "Error: The server was not able to reach MongoDB. Maybe it's not running?"
      );
      process.exit(1);
    } else {
      throw err;
    }
  });
