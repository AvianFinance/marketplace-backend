const { ethers } = require("hardhat")
const fs = require('fs');
const mplace_contract = require('../config/contract')

async function getTokenCounter(token_address) {

    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
    const m_contract = mplace_contract.createABI();
    const type = await m_contract.isRentableNFT(token_address);

    if (type==false){
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXGeneral.sol/AVFXGeneral.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    } else if (type==true){
        const Token = JSON.parse(fs.readFileSync('./artifacts/contracts/AVFXRent.sol/AVFXRent.json', 'utf-8'))
        const contract = new ethers.Contract(token_address, Token.abi, provider)
        const tokenCounter = await contract.tokenCounter()
        return tokenCounter
    }
}

module.exports = {
    getTokenCounter
};