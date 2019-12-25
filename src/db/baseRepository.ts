/**
 * Handles connection to mongo database
 */
import config from "config";
const mongoose = require("mongoose");
(mongoose as any).Promise = require("bluebird");
let dbName;

// Based on node environment, choose collection name
switch (config.get("production")) {
  case "test":
    dbName = "test";
    break;
  case "production":
    dbName = "prod";
    break;
  default:
    dbName = "dev";
}

const dbAddress = config.get("db.address");
const dbPort = config.get("db.port");

const options = {
  useMongoClient: true,
  user: "",
  pass: ""
};

// Check for auth needed
if (config.get("db.auth")) {
  options.user = config.get("db.username");
  options.pass = config.get("db.password");
}

// Connect to mongo
mongoose
  // .connect(`mongodb://${dbAddress}:${dbPort}/${dbName}`)
  .connect("mongodb://127.0.0.1:27017/?")
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
