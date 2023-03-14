const dbo = require('../database/conn')
const mplace_contract = require('../services/contract_create')
const collectionName = "collections"
const logger = require("../utils/logger")

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
      createdBy: req.body.createdBy,
      createdAt: new Date(),
      modifiedAt: new Date()
   };
   try {
      let create = await collection.insertOne(collectionDocument);
      let collectionCreated = { _id: create.insertedId };
      let coll = await collection.findOne(collectionCreated);
      logger.info("New Collection Created!")
      res.send(coll).status(201);
   } catch (e) {
      logger.error(e);
      res.send(e).status(500);
   };
}

// @desc Get the collections
// @route GET /api/collection/:userAddress
const getCollectionByID = async (req, res) => {
   const db = dbo.getDb();
   let query = { createdBy: req.params.userAddress };

   db.collection("collections").find(query).toArray(function (err, result) {
      if (err) throw err;
      res.send(result).status(200)
   })
}

module.exports = {
   createCollection,
   getCollectionByID
}
