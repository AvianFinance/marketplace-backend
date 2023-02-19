const dbo = require('../database/conn')
const mplace_contract = require('../config/contract')
const { uploadToPinata } = require('../services/pinata_upload')
const { getTokenCounter } = require('../services/token_counter')
const FormData = require('form-data');
const fs = require('fs');

// @desc Upload to IPFS
// @route POST /api/mint/ipfs
const mintNFT = async (req, res) => {
    const img_name = req.file.originalname

    const token_address = req.body.collectionAddress;
    const nft_name = req.body.nft_name
    const nft_desc = req.body.nftDescription

    const file = req.file;
    const formData = new FormData();
    formData.append('file', fs.readFileSync(file.path),img_name);

    console.log("Image Uploading to Pinata...")
    
    const tokenCounter = await getTokenCounter(token_address)

    const ipfsHash = await uploadToPinata(formData, tokenCounter, nft_name, nft_desc)
    console.log(ipfsHash)
    res.send(ipfsHash).status(200);
}

const saveMintNFT = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("nft_details");
    const nftDocument = {
        coll_addr: req.body.coll_addr,
        token_id: req.body.token_id,
        name: req.body.name,
        desc: req.body.desc,
        uri: req.body.uri,
    };
    let create = await collection.insertOne(nftDocument);
    let nftCreated = {_id: create.insertedId};
    let nft = await collection.findOne(nftCreated);
    res.send(nft).status(201);
}

module.exports = { 
    mintNFT,
    saveMintNFT
}