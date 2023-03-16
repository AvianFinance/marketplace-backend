const { ethers } = require("hardhat")
const config = require('../config/app-config')
const amplace_token  = config.amplace_token
const insmplace_token  = config.insmplace_token
const fs = require('fs');
const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'));
const InstallmentMplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianInstallment.sol/AvianInstallment.json', 'utf-8'))

let mplace_contract = null;
let insmplace_contract = null;

function createABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const mplace_contract = new ethers.Contract(amplace_token, Marketplace.abi, provider);
    return mplace_contract
}

function createInsABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const insmplace_contract = new ethers.Contract(insmplace_token, InstallmentMplace.abi, provider);
    return insmplace_contract
}

module.exports = {
    createABI,
    createInsABI
};