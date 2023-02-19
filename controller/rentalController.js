const dbo = require('../database/conn')
const mplace_contract = require('../config/contract')
const collectionName = "collections"

// @desc Get the rentals
// @route GET /api/rental/explore
const getRentalCollections = async (req, res) => {
  const m_contract = mplace_contract.createABI();
  const db = dbo.getDb();
  let collection = await db.collection(collectionName);

  const tx = await m_contract.getRListedAdddresses() // Gives all the token addresses listed for renting
  console.log(tx)
  // tx = ["0xA5e80F4980878b7C2c23D6fA002358A47d0060a3","0x4909493F604AB882327ca880ad5B330e2B3C43C1"]
  output = []
 
  for (i in tx) {
      let query = { _id: tx[i]};
      let result = await collection.findOne(query);
      console.log(result)
      let tokensList = await db.collection("nft_details").find({coll_addr: tx[i]}).toArray();
      console.log(tokensList)
      if (tokensList.length > 0) {
          result.count = tokensList.length
          let uriList = []
          for (token in tokensList) {
            // console.log(tokenList[token])
            uriList.push(tokensList[token].uri)
          }
          if(uriList.length > 4) {
            uriList = uriList.slice(0, 4)
          }
          result.tokens = uriList
      }
      output.push(result);
  }
  res.send(output).status(200)
}

// @desc Get the rentals in a collection
// @route GET /api/rental/explore/:collectionID
const getRentalCollectionTokens = async (req, res) => {
  const m_contract = mplace_contract.createABI();
    const token_address = req.params.collectionId
    const tx = await m_contract.getRListedAdddressTokens(token_address);

    const db = dbo.getDb();
    let collection = await db.collection("nft_details");
 
    let output = []
    for (i in tx) {
      let query = { coll_addr : token_address, token_id : tx[i].toNumber()}
      let result = await collection.find(query).toArray();
      output.push(result[0])
    }
    res.send(output).status(200);
}

module.exports = { 
  getRentalCollections,
  getRentalCollectionTokens
}