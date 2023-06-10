const { ethers } = require("hardhat")
const config = require('../config/app-config')
const fs = require('fs');

//Deployed token addresses
const amplace_token = config.amplace_token
const insmplace_token = config.insmplace_token
const sell_exchange_token = config.sell_exchange_token
const rent_exchange_token = config.rent_exchange_token
const inst_exchange_token = config.inst_exchange_token

//ABI Files
const Marketplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianMarkett.sol/AvianMarkett.json', 'utf-8'));
const InstallmentMplace = JSON.parse(fs.readFileSync('./artifacts/contracts/AvianInstallment.sol/AvianInstallment.json', 'utf-8'))
const SellExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/ASEProxy.sol/ASE_Proxy.json', 'utf-8'))
const RentExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/AREProxy.sol/ARE_Proxy.json', 'utf-8'))
const InstExchange = JSON.parse(fs.readFileSync('./artifacts/contracts/AIEProxy.sol/AIE_Proxy.json', 'utf-8'))

//Instantiation
let mplace_contract = null;
let insmplace_contract = null;
let sell_exchange_contract = null;
let rent_exchange_contract = null;
let inst_exchange_contract = null;

//Create ABI functions
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

function createASEPABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const sell_exchange_contract = new ethers.Contract(sell_exchange_token, SellExchange.abi, provider);
    return sell_exchange_contract
}

function createAREPABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const rent_exchange_contract = new ethers.Contract(rent_exchange_token, RentExchange.abi, provider);
    return rent_exchange_contract
}

function createAIEPABI() {
    const provider = new ethers.providers.WebSocketProvider(`wss://api.avax-test.network/ext/bc/C/ws`);
    const inst_exchange_contract = new ethers.Contract(inst_exchange_token, InstExchange.abi, provider);
    return inst_exchange_contract
}

module.exports = {
    createABI,
    createInsABI,
    createASEPABI,
    createAREPABI,
    createAIEPABI
};