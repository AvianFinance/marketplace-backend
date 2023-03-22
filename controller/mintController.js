const dbo = require('../database/conn')
const { sendMetadata } = require('../services/pinata_upload')
const { getTokenCounter, getTokenType } = require('../services/token_counter')
const logger = require('../utils/logger');

// @desc Upload to IPFS
// @route POST /api/mint/ipfs
const mintNFT = async (req, res, next) => {

    const token_address = req.body.coll_addr;
    const nft_name = req.body.nftName
    const nft_desc = req.body.nftDescription
    const IPFSLink = req.body.uri

    const tokenCounter = await getTokenCounter(token_address)

    const ipfsHash = await sendMetadata(IPFSLink, nft_name, nft_desc, tokenCounter)
    const token_type = await getTokenType(token_address)
    logger.info("Metadata uploaded to IPFS")
    res.send({ ipfsHash, token_type, tokenCounter }).status(200);
}

// @desc Save NFT details
// @route POST /api/mint
const saveMintNFT = async (req, res, next) => {
    //TODO ENHC: Save usernames 
    try {
        const db = dbo.getDb();
        let collectionType = await db.collection("collections").findOne({ _id: req.body.coll_addr });
        const nftDocument = {
            coll_addr: req.body.coll_addr,
            token_id: req.body.token_id,
            name: req.body.name,
            desc: req.body.desc,
            uri: req.body.uri,
            token_type: collectionType.tokenType,
            owner: req.body.minter,
            minter: req.body.minter,
            expiry: 0,
            user: req.body.minter,
            sell_listed_status: false,
            rent_listed_status: false,
            inst_listed_status: false,
        };

        let create = await db.collection("nft_details").insertOne(nftDocument);
        let nftCreated = { _id: create.insertedId };
        let nft = await db.collection("nft_details").findOne(nftCreated);
        logger.info("NFT minted successfully")
        res.send(nft).status(201);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

module.exports = {
    mintNFT,
    saveMintNFT
}
