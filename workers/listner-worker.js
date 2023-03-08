const { ethers } = require("hardhat")
const config = require('../config/app-config')
const amplace_token  = config.amplace_token
const fs = require('fs');
const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'))
const {parentPort, workerData} = require("worker_threads");

async function getTransfer(){

    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);

    const mplace_contract = new ethers.Contract(amplace_token, Marketplace.abi, provider)

    console.log("Listening to the blockchain.........")

    mplace_contract.on("ItemListed", (seller, nftAddress, tokenId, price)=>{

        let transferEvent = {
            seller: seller,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        }

        let message = {
            event: "ItemListed",
            data : transferEvent
        }

        parentPort.postMessage(message);

    })

    mplace_contract.on("ItemCanceled", (seller, nftAddress, tokenId)=>{

        let transferEvent ={
            seller: seller,
            nftAddress: nftAddress,
            tokenId: tokenId,
        }

        let message = {
            event: "ItemCanceled",
            data : transferEvent
        }

        parentPort.postMessage(message);

    })

    mplace_contract.on("ItemBought", (buyer, nftAddress, tokenId, price)=>{

        let transferEvent ={
            buyer: buyer,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        }

        let message = {
            event: "ItemBought",
            data : transferEvent
        }

        parentPort.postMessage(message);

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

        let message = {
            event: "NFTListed",
            data : transferEvent
        }

        parentPort.postMessage(message);
    })

    mplace_contract.on("NFTRented", (owner, user, nftContract, tokenId, startDateUNIX, endDateUNIX, expires, rentalFee)=>{

        let transferEvent ={
            owner: owner,
            user: user,
            nftContract: nftContract, 
            tokenId: tokenId, 
            startDateUNIX: startDateUNIX, 
            endDateUNIX: endDateUNIX, 
            expires: expires,
            rentalFee: rentalFee, 
        }

        let message = {
            event: "NFTRented",
            data : transferEvent
        }

        parentPort.postMessage(message);

    })

    mplace_contract.on("NFTUnlisted", (unlistSender, nftContract, tokenId, refund)=>{

        let transferEvent ={
            unlistSender: unlistSender,
            nftContract: nftContract,
            tokenId: tokenId, 
            refund: refund, 
        }

        let message = {
            event: "NFTUnlisted",
            data : transferEvent
        }

        parentPort.postMessage(message);

    })
}

getTransfer()

module.exports = {
    getTransfer
};
