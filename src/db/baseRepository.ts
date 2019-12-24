/**
 * Handles connection to mongo database
 */
const mongoose = require("mongoose");
(mongoose as any).Promise = require("bluebird");
let dbName;

// Based on node environment, choose collection name
switch (process.env.NODE_ENV) {
  case "test":
    dbName = "test";
    break;
  case "production":
    dbName = "prod";
    break;
  default:
    dbName = "dev";
}

const dbAddress = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || 27017;

const options = {
  useMongoClient: true,
  user: "",
  pass: ""
};

// Check for auth needed
if (process.env.DB_AUTH === "true") {
  options.user = process.env.DB_USER || "";
  options.pass = process.env.DB_PASS || "";
}

console.log(dbName);

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
