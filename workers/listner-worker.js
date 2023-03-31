const { ethers } = require("hardhat")
const config = require('../config/app-config')
const fs = require('fs');
const { parentPort, workerData } = require("worker_threads");
const logger = require("../utils/logger")

const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'))
const InstallmentMplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianInstallment.sol/AvianInstallment.json', 'utf-8'))
const SellExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/ASEProxy.sol/ASE_Proxy.json', 'utf-8'))
const RentExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/AREProxy.sol/ARE_Proxy.json', 'utf-8'))
const InstExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/AIEProxy.sol/AIE_Proxy.json', 'utf-8'))

const amplace_token = config.amplace_token
const insmplace_token = config.insmplace_token
const sell_exchange_token = config.sell_exchange_token
const rent_exchange_token = config.rent_exchange_token
const inst_exchange_token = config.inst_exchange_token

async function getTransfer() {

    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);

    const mplace_contract = new ethers.Contract(amplace_token, Marketplace.abi, provider)
    const insmplace_contract = new ethers.Contract(insmplace_token, InstallmentMplace.abi, provider)
    const sell_exchange_contract = new ethers.Contract(sell_exchange_token, SellExchange.abi, provider)
    const rent_exchange_contract = new ethers.Contract(rent_exchange_token, RentExchange.abi, provider)
    const inst_exchange_contract = new ethers.Contract(inst_exchange_token, InstExchange.abi, provider)

    logger.info("Listening to the blockchain.........")

    sell_exchange_contract.on("ItemListed", (seller, nftAddress, tokenId, price) => {

        let transferEvent = {
            seller: seller,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        }

        let message = {
            event: "ItemListed",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    sell_exchange_contract.on("ItemCanceled", (seller, nftAddress, tokenId) => {

        let transferEvent = {
            seller: seller,
            nftAddress: nftAddress,
            tokenId: tokenId,
        }

        let message = {
            event: "ItemCanceled",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    sell_exchange_contract.on("ItemBought", (buyer, nftAddress, tokenId, price) => {

        let transferEvent = {
            buyer: buyer,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        }

        let message = {
            event: "ItemBought",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    rent_exchange_contract.on("NFTListed", (owner, user, nftContract, tokenId, pricePerDay, expires) => {

        let transferEvent = {
            owner: owner,
            user: user,
            nftContract: nftContract,
            tokenId: tokenId,
            pricePerDay: pricePerDay,
            expires: expires,
        }

        let message = {
            event: "NFTListed",
            data: transferEvent
        }

        parentPort.postMessage(message);
    })

    rent_exchange_contract.on("NFTRented", (owner, user, nftContract, tokenId, expires, rentalFee) => {

        let transferEvent = {
            owner: owner,
            user: user,
            nftContract: nftContract,
            tokenId: tokenId,
            expires: expires,
            rentalFee: rentalFee,
        }

        let message = {
            event: "NFTRented",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    rent_exchange_contract.on("NFTUnlisted", (unlistSender, nftContract, tokenId) => {

        let transferEvent = {
            unlistSender: unlistSender,
            nftContract: nftContract,
            tokenId: tokenId,
        }

        let message = {
            event: "NFTUnlisted",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    inst_exchange_contract.on("INSNFTListed", (owner, user, nftContract, tokenId, pricePerDay) => {

        let transferEvent = {
            owner: owner,
            user: user,
            nftContract: nftContract,
            tokenId: tokenId,
            pricePerDay: pricePerDay,
        }

        let message = {
            event: "INSNFTListed",
            data: transferEvent
        }

        parentPort.postMessage(message);

    })

    inst_exchange_contract.on("NFTINSPaid", (owner, user, nftContract, tokenId, expires, insCount, insIndex, insAmount, totalPaid) => {

        let transferEvent = {
            owner: owner,
            user: user,
            nftContract: nftContract,
            tokenId: tokenId,
            expires: expires,
            insCount: insCount,
            insIndex: insIndex,
            insAmount: insAmount,
            totalPaid: totalPaid,
        }

        let message = {
            event: "NFTINSPaid",
            data: transferEvent
        }

        parentPort.postMessage(message);
        
    })
}

getTransfer()

module.exports = {
    getTransfer
};
