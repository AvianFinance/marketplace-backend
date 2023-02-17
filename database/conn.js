const { MongoClient } = require("mongodb");
// const connectionString = process.env.MONGODB_CONNECTION_STRING;
const connectionString = "mongodb+srv://avfx_root:irmiot4462281@avianfinance.qc7bqtj.mongodb.net/?retryWrites=true&w=majority"
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
 
      dbConnection = db.db("AVFX_Events");
      console.log("Successfully connected to MongoDB.");
 
      return callback();
    });
  },
 
  getDb: function () {
    return dbConnection;
  },
};