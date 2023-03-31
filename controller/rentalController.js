const dbo = require('../database/conn')
const contract_service = require('../services/contract_create')
const collectionName = "collections"
const { getUserByAddress } = require('./userController')
const logger = require('../utils/logger')

// @desc Get the rentals
// @route GET /api/rental/explore
const getRentalCollections = async (req, res, next) => {
  try {
    const rent_exchange_contract = contract_service.createAREPABI();
    const inst_exchange_contract = contract_service.createAIEPABI();
  
    const db = dbo.getDb();
    let collection = await db.collection(collectionName);
    logger.info(`Getting rental collection explore details..`)
    const r_tx = await rent_exchange_contract.getRListedAdddresses() // Gives all the token addresses listed for renting
    // logger.info(`Rental list ${r_tx}`)
    const ins_tx = await inst_exchange_contract.getInsListedAdddresses() // Gives all the token addresses listed for installement renting
    // logger.info(`Installement Rental list ${ins_tx}`)
  
    output = []
    r_output = []
    ins_output = []
  
    for (i in r_tx) {
      let query = { _id: r_tx[i] };
      let result = await collection.findOne(query);
      if (result) {
        let user = await getUserByAddress(result.createdBy)
        result.createdUserName = user.name
        result.createdUserImage = user.profileImage
        result.type = "UPRIGHT"
  
        let tokensList = await db.collection("nft_details").find({ coll_addr: r_tx[i] }).toArray();
  
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
        r_output.push(result);
      } else {
        logger.info(`Details of Collection ${r_tx[i]} is not in the database`)
      }
    }
  
    for (i in ins_tx) {
      let query = { _id: ins_tx[i] };
      let result = await collection.findOne(query);
      if (result) {
        let user = await getUserByAddress(result.createdBy)
        result.createdUserName = user.name
        result.createdUserImage = user.profileImage
        result.type = "INST"
  
        let tokensList = await db.collection("nft_details").find({ coll_addr: ins_tx[i] }).toArray();
  
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
        ins_output.push(result);
      } else {
        logger.warn(`Details of Collection ${ins_tx[i]} is not in the database`)
      }
    }
    output = { upright: r_output, inst: ins_output }
    res.send(output).status(200)
  } catch (err) {
    logger.error(err);
    next({ status: 500, message: err.message })
  }
  
}

// @desc Get the rentals in a collection
// @route GET /api/rental/explore/:collectionID
const getRentalCollectionTokens = async (req, res, next) => {

  try {
    const rent_exchange_contract = contract_service.createAREPABI();
    const inst_exchange_contract = contract_service.createAIEPABI();
  
    const db = dbo.getDb();
    
    const token_address = req.params.collectionId
    logger.info(`Getting rental tokens..`)
    const collection_data = await db.collection("collections").findOne({ _id: token_address })
    const r_tx = await rent_exchange_contract.getRListedAdddressTokens(token_address);
    const ins_tx = await inst_exchange_contract.getInsListedAdddressTokens(token_address);

    let collection = await db.collection("nft_details");

    output = []
    r_output = []
    ins_output = []

    for (i in r_tx) {
      let query = { coll_addr: token_address, token_id: r_tx[i].toNumber() }
      let result = (await collection.find(query).toArray())[0];
      if (result) {
        const listing = await rent_exchange_contract.getARListing(token_address, r_tx[i].toNumber());
        result.pricePerDay = listing.pricePerDay
        result.expires = listing.expires
        result.type = "UPRIGHT"
        r_output.push(result)
      } else {
        logger.info(`Details of token ${r_tx[i]} is not in the database`)
      }
    }

    for (i in ins_tx) {
      let query = { coll_addr: token_address, token_id: ins_tx[i].toNumber() }
      let result = (await collection.find(query).toArray())[0];
      if (result) {
        const listing = await inst_exchange_contract.getAInsListing(token_address, ins_tx[i].toNumber());
        result.pricePerDay = listing.pricePerDay
        result.installmentCount = listing.installmentCount
        result.installmentIndex = listing.installmentIndex
        result.expires = listing.expires
        result.paidIns = listing.paidIns
        result.type = "INST"
        ins_output.push(result)
      } else {
        logger.warn(`Details of token ${ins_tx[i]} is not in the database`)
      }
    }
    output = { collection: collection_data, upright: r_output, inst: ins_output }
    res.send(output).status(200);
  } catch (err) {
    logger.error(err);
    next({ status: 500, message: err.message })
  }
}

module.exports = {
  getRentalCollections,
  getRentalCollectionTokens
}
