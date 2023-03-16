const dbo = require('../database/conn')
const mplace_contract = require('../services/contract_create')
const collectionName = "collections"
const { getUserByAddress } = require('./userController')
const logger = require('../utils/logger')

// @desc Get the rentals
// @route GET /api/rental/explore
const getRentalCollections = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const instm_contract = mplace_contract.createInsABI();

  const db = dbo.getDb();
  let collection = await db.collection(collectionName);

  const r_tx = await m_contract.getRListedAdddresses() // Gives all the token addresses listed for renting
  logger.info(r_tx)
  const ins_tx = await instm_contract.getInsListedAdddresses() // Gives all the token addresses listed for installement renting
  logger.info(ins_tx)

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
      logger.info(`Details of Collection ${ins_tx[i]} is not in the database`)
    }
  }
  output = { upright: r_output, inst: ins_output }
  res.send(output).status(200)
}

// @desc Get the rentals in a collection
// @route GET /api/rental/explore/:collectionID
const getRentalCollectionTokens = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const instm_contract = mplace_contract.createInsABI();

  const token_address = req.params.collectionId
  try {
    const r_tx = await m_contract.getRListedAdddressTokens(token_address);
    const ins_tx = await instm_contract.getInsListedAdddressTokens(token_address);

    const db = dbo.getDb();
    let collection = await db.collection("nft_details");

    output = []
    r_output = []
    ins_output = []

    for (i in r_tx) {
      let query = { coll_addr: token_address, token_id: r_tx[i].toNumber() }
      let result = (await collection.find(query).toArray())[0];
      if (result) {
        const listing = await m_contract.getARListing(token_address, r_tx[i].toNumber());
        result.pricePerDay = listing.pricePerDay
        result.startDateUNIX = listing.startDateUNIX
        result.endDateUNIX = listing.endDateUNIX
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
        const listing = await instm_contract.getAInsListing(token_address, ins_tx[i].toNumber());
        result.pricePerDay = listing.pricePerDay
        result.installmentCount = listing.installmentCount
        result.installmentIndex = listing.installmentIndex
        result.expires = listing.expires
        result.paidIns = listing.paidIns
        result.type = "INST"
        ins_output.push(result)
      } else {
        logger.info(`Details of token ${ins_tx[i]} is not in the database`)
      }
    }
    output = { upright: r_output, inst: ins_output }
    res.send(output).status(200);
  } catch (err) {
    logger.error("Invalid Contract address")
    res.status(500).send({ message: 'Invalid contract address!'});
  }
}

module.exports = {
  getRentalCollections,
  getRentalCollectionTokens
}
