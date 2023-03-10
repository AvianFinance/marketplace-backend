const dbo = require('../database/conn')
const mplace_contract = require('../services/contract_create')
const collectionName = "collections"
const { getUserByAddress } = require('./userController')

// @desc Get the rentals
// @route GET /api/buy/explore
const getBuyCollections = async (req, res) => {
    const m_contract = mplace_contract.createABI();
    const db = dbo.getDb();
    let collection = await db.collection(collectionName);

    const tx = await m_contract.getSListedAdddresses() // Gives all the token addresses listed for renting
    // console.log(tx)
    // tx = ["0xA5e80F4980878b7C2c23D6fA002358A47d0060a3","0x4909493F604AB882327ca880ad5B330e2B3C43C1"]
    output = []
   
    for (i in tx) {
      let query = { _id: tx[i]};
      let result = await collection.findOne(query);
      let user = await getUserByAddress(result.createdBy)
      result.createdUserName = user.name
      result.createdUserImage = user.profileImage

      let tokensList = await db.collection("nft_details").find({coll_addr: tx[i]}).toArray();

      if (tokensList.length > 0) {
          result.count = tokensList.length
          let uriList = []
          for (token in tokensList) {
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
// @route GET /api/buy/explore/:collectionID
const getBuyCollectionTokens = async (req, res) => {
    const m_contract = mplace_contract.createABI();
    const token_address = req.params.collectionId

    const tx = await m_contract.getSListedAdddressTokens(token_address);

    const db = dbo.getDb();
    let collection = await db.collection("nft_details");
 
    let output = []
    for (i in tx) {
      let query = { coll_addr : token_address, token_id : tx[i].toNumber()}
      let result = (await collection.find(query).toArray())[0];
      const listing= await m_contract.getASListing(token_address, tx[i].toNumber() );
      result.price = listing.price
      output.push(result)
    }
    res.send(output).status(200);
}

module.exports = { 
  getBuyCollections,
  getBuyCollectionTokens
}