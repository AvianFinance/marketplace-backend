const dbo = require('../database/conn')
const mplace_contract = require('../config/contract')
const collectionName = "collections"

// @desc Get the rentals
// @route GET /api/buy/explore
const getBuyCollections = async (req, res) => {
    const m_contract = mplace_contract.createABI();
    const db = dbo.getDb();
    let collection = await db.collection(collectionName);

    const tx = await m_contract.getSListedAdddresses() // Gives all the token addresses listed for renting
    console.log(tx)
    // tx = ["0xA5e80F4980878b7C2c23D6fA002358A47d0060a3","0x4909493F604AB882327ca880ad5B330e2B3C43C1"]
    output = []
   
    for (i in tx) {
        let query = { _id: tx[i]};
        let result = await collection.findOne(query);
        
        if (result.tokens.length > 0) {
            let tokenList = result.tokens
            let uriList = []
            for (token in tokenList) {
              // console.log(tokenList[token])
              uriList.push(tokenList[token].uri)
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
  const token_address = "0xA5e80F4980878b7C2c23D6fA002358A47d0060a3"
  const tx = await m_contract.getSListedAdddressTokens(token_address);
  res.send(tx).status(200);
}

module.exports = { 
  getBuyCollections,
  getBuyCollectionTokens
}