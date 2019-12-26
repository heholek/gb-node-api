/**
 * Handles connection to mongo database
 */
import config from "config";
const mongoose = require("mongoose");
(mongoose as any).Promise = require("bluebird");
let dbName = "dev";

// Based on node environment, choose collection name
if (config.get("production")) {
  dbName = "production";
}

const dbAddress = config.get("db.address");
const dbPort = config.get("db.port");

const options = {
  useMongoClient: true,
  user: "",
  pass: ""
};

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
