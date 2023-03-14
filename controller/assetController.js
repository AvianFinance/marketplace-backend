const dbo = require("../database/conn");

const getOneNft = async (req, res) => {
    const db = dbo.getDb();
    let query = { coll_addr : req.params.collectionId , token_id : parseInt(req.params.tokenId) } ;
    let result = await db.collection("nft_details").findOne(query);
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
}

module.exports = { 
    getOneNft
}
