const { ethers } = require("hardhat")
const { amplace_token } = require('../config')
const fs = require('fs');
const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'));

let mplace_contract = null;

function createABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const mplace_contract = new ethers.Contract(amplace_token, Marketplace.abi, provider);
    return mplace_contract
}

module.exports = {
    createABI
};