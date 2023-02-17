const { MongoClient } = require("mongodb");

const connectionString = process.env.MONGODB_CONNECTION_STRING || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("AVFX_Events");

export default db;