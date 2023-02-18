const db = require('../database/conn')
const mplace_contract = require('../config/contract')

// @desc Get the rentals
// @route GET /api/buy/explore
const getBuyCollections = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const tx = await m_contract.getSellListings() // Gives all the token addresses listed for renting
  res.send(tx).status(200);
}

// @desc Get the rentals in a collection
// @route GET /api/buy/explore/:collectionID
const getBuyCollectionTokens = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const token_address = "0xA5e80F4980878b7C2c23D6fA002358A47d0060a3"
  const tx = await m_contract.getSListedAdddressTokens(token_address);
  res.send(tx).status(200);
}

module.exports = { 
  getBuyCollections,
  getBuyCollectionTokens
}