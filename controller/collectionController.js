const dbo = require('../database/conn')
const mplace_contract = require('../config/contract')
const collectionName = "collections"

// @desc Get the rentals
// @route GET /api/collection/
const createCollection = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection(collectionName);
    const collectionDocument = {
        _id: req.body.address,
        name: req.body.name,
        symbol: req.body.symbol,
        tokenType: req.body.tokenType,
        tokens: {},
        createdAt: new Date(),
        modifiedAt: new Date()
    };
    try {
      let create = await collection.insertOne(collectionDocument);
      let collectionCreated = {_id: create.insertedId};
      let coll = await collection.findOne(collectionCreated);
      console.log("New Collection Created!")
      res.send(coll).status(201);
   } catch (e) {
      console.log(e);
      res.send(e).status(500);
   };
}

module.exports = { 
  createCollection
}