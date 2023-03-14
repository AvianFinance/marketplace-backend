const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');

const API_KEY = "668b0b44d1e4a05bc600"
const API_SECRET = "974f70a719445d92a968a34fc3dea98ad2a4064f4ef7e0c9283a7c1b29af8e71"


async function uploadToPinata(formData, tokenId, nft_title, nft_desc) {

    // the endpoint needed to upload the file
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    const response = await axios.post(
        url,
        formData,
        {
            maxContentLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET

            }
        }
    )
    return await sendMetadata(response.data.IpfsHash, nft_title, nft_desc, tokenId)
}

async function sendMetadata(IPFSHash, nft_title, nft_desc, tokenId) {

    const JSONBody = {
        name: nft_title,
        tokenId: tokenId,
        image: IPFSHash,
        description: nft_desc,
        attributes: []
    }
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const response = await axios.post(
        url,
        JSONBody,
        {
            maxContentLength: "Infinity",
            headers: {
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET

            }
        }
    ).catch(function (error) {
        logger.info(error.response.data.error)
    })
    logger.info(response.data.IpfsHash)
    return {
        "ipfsHash": response.data.IpfsHash,
        "imageUri": `https://gateway.pinata.cloud/ipfs/${IPFSHash}`
    }
}

module.exports = {
    sendMetadata,
};
