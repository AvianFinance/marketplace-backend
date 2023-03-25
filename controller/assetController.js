const dbo = require("../database/conn");
const { getUserByAddress } = require('./userController')
const logger = require("../utils/logger")

const getOneNft = async (req, res, next) => {
    try {
        const db = dbo.getDb();
        let query = { coll_addr: req.params.collectionId, token_id: parseInt(req.params.tokenId) };
        let nft_data = await db.collection("nft_details").findOne(query);
        // console.log(nft_data)
        
        if (nft_data) {
            nft_data.minterName = (await getUserByAddress(nft_data.minter)).name || "undefined"
            nft_data.userName = (await getUserByAddress(nft_data.user)).name || "undefined"
            const nft_owner = await getUserByAddress(nft_data.owner)
            nft_data.ownerName = nft_owner.name || "undefined"
            nft_data.ownerProfileImage = nft_owner.profileImage || "undefined"

            let collection_data = await db.collection("collections").findOne({ _id: req.params.collectionId });
            const collection_owner = await getUserByAddress(collection_data.createdBy);
            collection_data.creatorName = collection_owner.name || "undefined"
            collection_data.creatorProfileImage = collection_owner.profileImage || "undefined"

            let listings = [];
            if(nft_data.sell_listed_status){
                const s_query = { nftAddress: req.params.collectionId, tokenId: parseInt(req.params.tokenId), listed_status: true, sold_status: false };
                let sell_listed = await db.collection("sell_listings").findOne(s_query);
                if ( sell_listed ) listings.push(sell_listed) ;
            }
            if(nft_data.rent_listed_status){
                const r_query = { nftContract: req.params.collectionId, tokenId: parseInt(req.params.tokenId), listed_status : true, rent_status: false};
                let rent_listed = await db.collection("rental_listings").findOne(r_query);
                if (rent_listed)  listings.push(rent_listed) ;
            }
            if(nft_data.inst_listed_status){
                const i_query = { nftContract: req.params.collectionId, tokenId: parseInt(req.params.tokenId), listed_status : true, inst_status: "LISTED"};
                let inst_listed = await db.collection("inst_listings").findOne(i_query);
                if (inst_listed) listings.push(inst_listed);
            }

            let expires = parseInt(nft_data.expiry._hex)
            let now = Date.now() / 1000

            if(!nft_data.inst_listed_status && (expires > now)) {
                const i_query = { nftContract: req.params.collectionId, tokenId: parseInt(req.params.tokenId), listed_status : false, inst_status: "PAYING"};
                let installment = await db.collection("inst_listings").findOne(i_query);
                if (installment) listings.push(installment);
            }
            let output = { nft: nft_data, collection: collection_data, listing : listings }
            res.send(output).status(200);
        } else {
            res.send({ error: true, "message": "Invalid collection/token ID" })
        }

    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

module.exports = {
    getOneNft
}
