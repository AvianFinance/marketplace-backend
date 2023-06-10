const { ethers } = require("hardhat")
const fs = require('fs');
const contract_service = require('../services/contract_create')

async function getTokenCounter(token_address) {

    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
    const type = await getTokenType(token_address)

    if (type == false) {
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXGeneral.sol/AVFXGeneral.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    } else if (type == true) {
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXRent.sol/AVFXRent.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    }
}

async function getTokenType(token_address) {
    
    const rent_exchange_contract = contract_service.createAREPABI();
    const type = await rent_exchange_contract.isRentableNFT(token_address);
    return type
}

module.exports = {
    getTokenCounter,
    getTokenType,
};
