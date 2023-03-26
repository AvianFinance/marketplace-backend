const { MongoClient } = require("mongodb");
const config = require('../config/app-config');
const logger = require("../utils/logger");

const connectionString = config.db_connection

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db(config.db_name);
      logger.info("Successfully connected to MongoDB Database");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
