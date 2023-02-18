// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AVFXRent is ERC4907 {
    uint256 public tokenCounter;
    uint256 public MAX_TOKENS = 1000; // maximum supply

    constructor(string memory _tokenName, string memory _tokenSymbol) 
    
    ERC4907(_tokenName, _tokenSymbol) {
        tokenCounter = 0;
    }

    function mint(string memory _tokenUri) public payable { //Creation and transfer to the wallet
        require(tokenCounter < MAX_TOKENS, "ERC4907: Max supply");
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, _tokenUri);
        tokenCounter = tokenCounter + 1;
    }
}
