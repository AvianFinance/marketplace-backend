const dbo = require('../database/conn')
const mplace_contract = require('../config/contract')
const collectionName = "collections"

// @desc Get the rentals
// @route GET /api/rental/explore
const getRentalCollections = async (req, res) => {
    const db = dbo.getDb();
    const m_contract = mplace_contract.createABI();

    const tx = await m_contract.getRListedAdddresses() // Gives all the token addresses listed for renting
    console.log(tx)

    tx.forEach(async function (item, index) {
      console.log(item, index);
      // let collection = await db.collection(collectionName);
      // let query = {_id: item};
      // let result = await collection.findOne(query);
      // console.log(result)
    });

    res.send(tx).status(200);
}

// @desc Get the rentals in a collection
// @route GET /api/rental/explore/:collectionID
const getRentalCollectionTokens = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const token_address = "0xA5e80F4980878b7C2c23D6fA002358A47d0060a3"
  // const tx = await m_contract.getRListedAdddressTokens(req.param.collectionID)
  const tx = await m_contract.getRListedAdddressTokens(token_address)
  res.send(tx).status(200);
}

module.exports = { 
  getRentalCollections,
  getRentalCollectionTokens
}