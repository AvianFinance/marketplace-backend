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

        //Add to market events
        const eventDocument = {
            nftContract: req.body.coll_addr,
            tokenId: req.body.token_id,
            event: "Mint",
            from: "",
            to: req.body.minter,
            price: "",
            createdAt: new Date()
        };

        let event = await db.collection("market_events").insertOne(eventDocument);
        res.send(nft).status(201);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

// @desc Save NFT details
// @route POST /api/mint
const depositNFT = async (req, res, next) => {
    try {
        const db = dbo.getDb();
        console.log(req.body)
        let collectionType = await db.collection("collections").findOne({ _id: req.body.coll_addr });
        const nftDocument = {
            coll_addr: req.body.coll_addr,
            token_id: req.body.token_id,
            name: req.body.name,
            desc: req.body.desc,
            uri: req.body.uri,
            token_type: req.body.token_type,
            owner: req.body.owner,
            minter: req.body.owner,
            expiry: 0,
            user: req.body.owner,
            sell_listed_status: false,
            rent_listed_status: false,
            inst_listed_status: false,
        };

        let create = await db.collection("nft_details").insertOne(nftDocument);
        let nftCreated = { _id: create.insertedId };
        let nft = await db.collection("nft_details").findOne(nftCreated);
        console.log(nft)
        logger.info("NFT saved successfully")

        const query = { coll_addr: req.body.baseCollection, token_id: parseInt(req.body.token_id)};
        const updates = {
            $set: {owner: req.body.coll_addr }
        };
        const update = await db.collection("nft_details").updateOne(query, updates);
        logger.info(`nft_details Update result: ${JSON.stringify(update)}`)

        //Add to market events
        const depositEvent = {
            nftContract: req.body.coll_addr,
            tokenId: req.body.token_id,
            event: "Deposit",
            from: req.body.owner,
            to: req.body.coll_addr,
            price: "",
            createdAt: new Date()
        }

        let event = await db.collection("market_events").insertOne(depositEvent);
        console.log(event)
        res.send(nft).status(201);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

module.exports = {
    mintNFT,
    saveMintNFT,
    depositNFT
}
