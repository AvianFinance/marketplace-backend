const dbo = require("../database/conn");

const getOwned = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("nft_details");
    let query = { minter: req.params.userAdd }
    let result = await collection.find(query).toArray();
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);

}

const getCollected = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("nft_details");
    let query = { owner: req.params.userAdd }
    let result = await collection.find(query).toArray();
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
}

const getRented = async (req, res) => {
    // const db = dbo.getDb();
    // let collection = await db.collection("users");
   
}

const getCollections = async (req, res) => {
    console.log(req.params.userAdd)
    const db = dbo.getDb();
    let collections = await db.collection("collections").find({createdBy: req.params.userAdd}).toArray();
   
    for (i in collections) {
      let tokensList = await db.collection("nft_details").find({coll_addr: collections[i]._id}).toArray();
      let result = []

      if (tokensList.length > 0) {
          let uriList = []
          for (token in tokensList) {
            uriList.push(tokensList[token].uri)
          }
          if(uriList.length > 4) {
            uriList = uriList.slice(0, 4)
          }
          collections[i].tokens = uriList
      }
  }
    res.send(collections).status(200)
}

async function getUserNameByAddress(userAdress) {
  
}

module.exports = { 
    getOwned, 
    getCollected, 
    getRented,
    getCollections
}