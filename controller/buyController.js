const dbo = require('../database/conn')
const contract_service = require('../services/contract_create')
const logger = require("../utils/logger")
const { getUserByAddress } = require('./userController')
const collectionName = "collections"

// @desc Get the rentals
// @route GET /api/buy/explore
const getBuyCollections = async (req, res, next) => {
  try {
    const sell_exchange_contract = contract_service.createASEPABI();
    const db = dbo.getDb();
    let collection = await db.collection(collectionName);

    const tx = await sell_exchange_contract.getSListedAdddresses() // Gives all the token addresses listed for renting
    output = []

    for (i in tx) {
      let query = { _id: tx[i] };
      let result = await collection.findOne(query);
      let user = await getUserByAddress(result.createdBy)
      result.createdUserName = user.name
      result.createdUserImage = user.profileImage

      let tokensList = await db.collection("nft_details").find({ coll_addr: tx[i] }).toArray();

      if (tokensList.length > 0) {
        result.count = tokensList.length
        let uriList = []
        for (token in tokensList) {
          uriList.push(tokensList[token].uri)
        }
        if (uriList.length > 4) {
          uriList = uriList.slice(0, 4)
        }
        result.tokens = uriList
      }
      output.push(result);
    }
    res.send(output).status(200)
  } catch (err) {
    logger.error(err);
    next({ status: 500, message: err.message })
  }
}

// @desc Get the rentals in a collection
// @route GET /api/buy/explore/:collectionID
const getBuyCollectionTokens = async (req, res, next) => {
  try {
    const sell_exchange_contract = contract_service.createASEPABI();
    const token_address = req.params.collectionId

    const tx = await sell_exchange_contract.getSListedAdddressTokens(token_address);

    const db = dbo.getDb();
    const collection_data = await db.collection("collections").findOne({ _id: token_address })
    let collection = await db.collection("nft_details");

    let tokens = []
    for (i in tx) {
      let query = { coll_addr: token_address, token_id: tx[i].toNumber() }
      let result = (await collection.find(query).toArray())[0];
      const listing = await sell_exchange_contract.getASListing(token_address, tx[i].toNumber());
      result.price = listing.price
      tokens.push(result)
    }
    output = { collection: collection_data, token: tokens }
    res.send(output).status(200);
  } catch (err) {
    logger.error(err);
    next({ status: 500, message: err.message })
  }
}

module.exports = {
  getBuyCollections,
  getBuyCollectionTokens
}
