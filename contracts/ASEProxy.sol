
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();


contract ASE_Proxy is ReentrancyGuard {

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    struct Listing_sell {
        address owner;
        address nftContract;
        uint256 tokenId;
        uint256 price;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ImplUpgrade(
        address indexed marketowner,
        address indexed newImplAddrs
    );

    // modifiers for marketplace checks

    modifier notSListed( 
        address nftAddress,
        uint256 tokenId
    ) {
        Listing_sell memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isSListed(address nftAddress, uint256 tokenId) {
        Listing_sell memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    // State Variables for the proxy

    address private _marketOwner;

    uint256 private _listingFee = .01 ether;

    mapping(address => mapping(uint256 => Listing_sell)) private s_listings;   

    mapping(address => uint256) private s_proceeds;
    
    mapping(address => EnumerableSet.UintSet) private s_address_tokens; 

    EnumerableSet.AddressSet private s_address; 

    Counters.Counter private s_listed;

    address private impl_sell;

    constructor(address _implContract) {
        _marketOwner = msg.sender;
        impl_sell = _implContract;
    }

    // Listing Functionality

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external returns(string memory) {
        (bool success, bytes memory data) = impl_sell.delegatecall(abi.encodeWithSignature("listItem(address,uint256,uint256)", nftAddress, tokenId, price));
        require(success, "transaction failed");
        return(abi.decode(data, (string)));
    }

    // Unlisting functionality

    function cancelListing(                           
        address nftAddress, 
        uint256 tokenId
    ) external returns(string memory){
        (bool success, bytes memory data) = impl_sell.delegatecall(abi.encodeWithSignature("cancelListing(address,uint256)", nftAddress, tokenId));
        require(success, "transaction failed");
        return(abi.decode(data, (string)));
    }

    // Buying and selling functionality

    function buyItem(          
        address nftAddress, 
        uint256 tokenId
    ) external payable returns(string memory) {
        (bool success, bytes memory data) = impl_sell.delegatecall(abi.encodeWithSignature("buyItem(address,uint256)", nftAddress, tokenId));
        require(success, "transaction failed");
        return(abi.decode(data, (string)));
    }

    // Update already listed listings

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external returns(string memory) {
        (bool success, bytes memory data) = impl_sell.delegatecall(abi.encodeWithSignature("updateListing(address,uint256,uint256)", nftAddress, tokenId, newPrice));
        require(success, "transaction failed");
        return(abi.decode(data, (string)));
    }

    // Withdraw Proceeds in the pull pattern. Used when multiple transactions are made within a single function

    function withdrawProceeds() external returns(string memory) {
        (bool success, bytes memory data) = impl_sell.delegatecall(abi.encodeWithSignature("withdrawProceeds()"));
        require(success, "transaction failed");
        return(abi.decode(data, (string)));
    }

    // Get a specific s_listing

    function getASListing(       
        address nftAddress, 
        uint256 tokenId
    ) external view
        returns (Listing_sell memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    // Get the proceeds available for a seller

    function getProceeds(       
    ) external view 
        returns (uint256) 
    {
        return s_proceeds[msg.sender];
    }

    // get the set of nft addresses listed for selling in the marketplace

    function getSListedAdddresses(
    ) public view 
        returns (address[] memory) 
    {
        address[] memory nftContracts = EnumerableSet.values(s_address);
        return nftContracts;
    }

    // get the set of nft token ids of a given nft address listed for selling

    function getSListedAdddressTokens(
        address nftAddress
    ) public view 
        returns (uint256[] memory) 
    {
        uint256[] memory tokens = EnumerableSet.values(s_address_tokens[nftAddress]);
        return tokens;
    }

    // function to check whether a given token is 721 or not

    function isNFT(address nftContract) public view returns (bool) {
        bool _isNFT = false;

        try IERC165(nftContract).supportsInterface(type(IERC721).interfaceId) returns (bool nft) {
            _isNFT = nft;
        } catch {
            return false;
        }
        return _isNFT;
    }
    // upgrade functionality

    function updateImplContract(
        address newImplAddrs
    ) external
        nonReentrant
    {
        require(msg.sender == _marketOwner, "marketplace can only be upgraded by the owner");
        impl_sell = newImplAddrs;
        emit ImplUpgrade(
            _marketOwner,
            impl_sell
        );
    }

    function getImplAddrs(
    ) public view 
        returns (address) 
    {
        return impl_sell;
    }
}