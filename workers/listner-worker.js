const { ethers } = require("hardhat")
const { amplace_token } = require('../config')
const fs = require('fs');
const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'))
const {parentPort, workerData} = require("worker_threads");


async function getTransfer(){

    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);

    const mplace_contract = new ethers.Contract(amplace_token, Marketplace.abi, provider)

    console.log("Listening to the blockchain.........")

    mplace_contract.on("ItemListed", (seller, nftAddress, tokenId, price)=>{

        let transferEvent ={
            seller: seller,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        }

        parentPort.postMessage(transferEvent);

    })

    mplace_contract.on("NFTListed", (owner, user, nftContract, tokenId, pricePerDay, startDateUNIX, endDateUNIX, expires)=>{

        let transferEvent ={
            owner: owner,
            user: user,
            nftContract: nftContract, 
            tokenId: tokenId, 
            pricePerDay: pricePerDay, 
            startDateUNIX: startDateUNIX, 
            endDateUNIX: endDateUNIX, 
            expires: expires,
        }

        parentPort.postMessage(transferEvent);

    })
}

getTransfer()

module.exports = {
    getTransfer
};
