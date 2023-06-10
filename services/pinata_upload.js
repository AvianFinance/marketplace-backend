const axios = require('axios');
const FormData = require('form-data');
const logger = require('../utils/logger');
const config = require('../config/app-config')

const API_KEY = config.pinata_api_key
const API_SECRET = config.pinata_api_secret

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
        logger.error(JSON.stringify(error.response.data.error))
        throw new Error(error.response.data.error.details)
    })

    if (response) {
        logger.info(`IpfHash : ${response.data.IpfsHash}`)
        return {
            "ipfsHash": response.data.IpfsHash,
            "imageUri": `https://gateway.pinata.cloud/ipfs/${IPFSHash}`
        }
    }
}

module.exports = {
    sendMetadata,
};
