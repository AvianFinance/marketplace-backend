const dbo = require("../database/conn");
const logger = require("../utils/logger")

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
    const db = dbo.getDb();
    let query = { token_type: "ERC4907", user : req.params.userAdd, expiry: {$ne : 0}}
    try {
        let output = []
        let result = await db.collection("nft_details").find(query).toArray();
        if (result) {
            for (i in result) {
                let expires = parseInt(result[i].expiry._hex)
                let now = Date.now()/1000
                if (expires > now) {
                    output.push(result[i])
                }
            }
        }
        logger.info(JSON.stringify(output))
        res.send(output).status(200);
    } catch(err) {
        logger.error(err)
        res.send({"error" : "true"})
    }
    
}

const getListed = async (req, res) => {
    const db = dbo.getDb();
    let query = { owner : req.params.userAdd, listed_status: true}
    try {
        let listed = await db.collection("nft_details").find(query).toArray();
        console.log(listed)
        res.send(listed).status(200);
    } catch (err) {
        console.log(err)
    }
    // let output = []
    // let slist = await db.collection("sell_listings").find({seller: req.params.userAdd, status: "LISTED"}).toArray();
    // console.log(slist)
    // let rlist = await db.collection("rental_listings").find({owner: req.params.userAdd, status: "LISTED"}).toArray();
    // console.log(rlist)
   
    // for (i in slist) {
    //   let token = await db.collection("nft_details").findOne({coll_addr: slist[i].nftAddress, token_id:slist[i].tokenId});
    //   let obj = slist[i]
    //   obj["imgUri"] = token.uri
    //   output.push(obj)
    // }

    // for (i in rlist) {
    //     let rtoken = await db.collection("nft_details").findOne({coll_addr: rlist[i].nftContract, token_id:rlist[i].tokenId});
    //     let robj = rtoken[i]
    //     robj["imgUri"] = rtoken.uri
    //     output.push(robj)
    // }
}

const getCollections = async (req, res) => {
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

const getLended = async (req, res) => {
    const db = dbo.getDb();
    let query = { token_type: "ERC4907", owner : req.params.userAdd, expiry: {$ne : 0}}
    try {
        let output = []
        let result = await db.collection("nft_details").find(query).toArray();
        if (result) {
            for (i in result) {
                let expires = parseInt(result[i].expiry._hex)
                let now = Date.now()/1000
                if (expires > now) {
                    output.push(result[i])
                }
            }
        }
        logger.info(JSON.stringify(output))
        res.send(output).status(200);
    } catch(err) {
        logger.error(err)
        res.send({"error" : "true"})
    }
}

module.exports = { 
    getOwned, 
    getCollected, 
    getRented,
    getCollections,
    getListed,
    getLended
}
