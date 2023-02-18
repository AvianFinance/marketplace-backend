const db = require('../database/conn')

// @desc Get the rentals
// @route GET /api/rental/explore
const getBuyCollections = async (req, res) => {
    let collection = await db.collection("posts");
    let results = await collection.find({})
      .limit(50)
      .toArray();
  
    res.send(results).status(200);
}

// @desc Get the rentals in a collection
// @route GET /api/rental/explore/:collectionID
const getBuyCollectionTokens = async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);
}

module.exports = { 
  getBuyCollections,
  getBuyCollectionTokens
}