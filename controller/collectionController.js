const dbo = require('../database/conn')
const logger = require("../utils/logger")

// @desc Create a new collection
// @route POST /api/collection
const createCollection = async (req, res, next) => {
   const db = dbo.getDb();
   const collectionDocument = {
      _id: req.body.address,
      name: req.body.name,
      symbol: req.body.symbol,
      tokenType: req.body.tokenType,
      createdBy: req.body.createdBy,
      coverImage: "https://res.cloudinary.com/isuruieee/image/upload/v1679563964/3_1_pnqx8w.png",
      wrappedStatus: false,
      wrappedCollection: "",
      wrapper: false,
      createdAt: new Date(),
      modifiedAt: new Date()
   };
   try {
      let create = await db.collection("collections").insertOne(collectionDocument);
      let collectionCreated = { _id: create.insertedId };
      let coll = await db.collection("collections").findOne(collectionCreated);
      logger.info("New Collection Created by name : " + req.body.name)
      res.send(coll).status(201);
   } catch (err) {
      logger.error(err);
      next({ status: 500, message: err.message })
   };
}

const createWrapperCollection = async (req, res, next) => {
   const db = dbo.getDb();
   const collectionDocument = {
      _id: req.body.address,
      name: req.body.name,
      symbol: req.body.symbol,
      tokenType: req.body.tokenType,
      createdBy: req.body.createdBy,
      coverImage: "https://res.cloudinary.com/isuruieee/image/upload/v1679563964/3_1_pnqx8w.png",
      wrappedStatus: false,
      wrappedCollection: "",
      wrapper: true,
      createdAt: new Date(),
      modifiedAt: new Date()
   };
   try {
      let create = await db.collection("collections").insertOne(collectionDocument);
      let collectionCreated = { _id: create.insertedId };
      let coll = await db.collection("collections").findOne(collectionCreated);
      logger.info("New Wrapper collection Created!")

      //Update collection status
      const updates = {
         $set: { wrappedStatus: true, wrappedCollection: req.body.address, modifiedAt: new Date() }
      };
      const update = await db.collection("collections").updateOne({ _id: req.body.baseCollection }, updates);
      logger.info(`collection details Update result: ${JSON.stringify(update)}`)
      res.send(coll).status(201);
   } catch (err) {
      logger.error(err);
      next({ status: 500, message: err.message })
   };
}

// @desc Get a collection by user Address
// @route GET /api/collection/:userAddress
const getCollectionByID = async (req, res, next) => {
   const db = dbo.getDb();
   let query = { createdBy: req.params.userAddress, wrapper: false };

   try {
      let result = await db.collection("collections").find(query).toArray();
      res.send(result).status(200)
   } catch (err) {
      logger.error(err);
      next({ status: 500, message: err.message })
   }
}

module.exports = {
   createCollection,
   getCollectionByID,
   createWrapperCollection
}
