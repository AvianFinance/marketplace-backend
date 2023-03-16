const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');

const API_KEY = "d96d1d45c7c5f1a11650"
const API_SECRET = "a880ba1d86b661d62650dc059f1bc23e2d28fcca6cfd430b0e2c2e6f679c3d9a"


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
