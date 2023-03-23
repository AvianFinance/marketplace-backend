const dbo = require('../database/conn')
const mplace_contract = require('../services/contract_create')
const { sendMetadata } = require('../services/pinata_upload')
const { getTokenCounter, getTokenType } = require('../services/token_counter')
const FormData = require('form-data');
const fs = require('fs');
const logger = require('../utils/logger');

// @desc Upload to IPFS
// @route POST /api/mint/ipfs
const mintNFT = async (req, res) => {

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

const saveMintNFT = async (req, res) => {
    const db = dbo.getDb();
    let collectionType = await db.collection("collections").findOne({ _id: req.body.coll_addr });
    let collection = await db.collection("nft_details");
    const nftDocument = {
        coll_addr: req.body.coll_addr,
        token_id: req.body.token_id,
        name: req.body.name,
        desc: req.body.desc,
        uri: req.body.uri,
        token_type: collectionType.tokenType,
        owner: req.body.minter,
        minter: req.body.minter,
        expiry: 0000,
        user: req.body.minter,
        listed_status: false,
    };
    try {
        let create = await collection.insertOne(nftDocument);
        let nftCreated = { _id: create.insertedId };
        let nft = await collection.findOne(nftCreated);
        logger.info("NFT minted successfully")
        res.send(nft).status(201);
    } catch(err) {
        logger.error(err)
        throw err
    }
}  

module.exports = {
    mintNFT,
    saveMintNFT
}
