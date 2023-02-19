const db = require('../database/conn')
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

module.exports = { 
    mintNFT
}