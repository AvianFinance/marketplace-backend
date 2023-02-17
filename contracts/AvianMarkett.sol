
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "./IERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();


contract AvianMarkett is ReentrancyGuard {

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    
    
    address private _marketOwner;
    uint256 private _listingFee = .001 ether;

    struct Listing_sell {
        address owner;
        address nftContract;
        uint256 tokenId;
        uint256 price;
    }

    struct Listing_rent {
        address owner;
        address user;
        address nftContract;
        uint256 tokenId;
        uint256 pricePerDay;
        uint256 startDateUNIX; // when the nft can start being rented
        uint256 endDateUNIX; // when the nft can no longer be rented
        uint256 expires; // when the user can no longer rent it
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

    // events for nft rentals

    event NFTListed(
        address indexed owner,
        address indexed user,
        address indexed nftContract,
        uint256 tokenId,
        uint256 pricePerDay,
        uint256 startDateUNIX,
        uint256 endDateUNIX,
        uint256 expires
    );
    event NFTRented(
        address indexed owner,
        address indexed user,
        address indexed nftContract,
        uint256 tokenId,
        uint256 startDateUNIX,
        uint256 endDateUNIX,
        uint64 expires,
        uint256 rentalFee
    );
    event NFTUnlisted(
        address indexed unlistSender,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 refund
    );

    // mapping for basics

    mapping(address => mapping(uint256 => Listing_sell)) private s_listings;   // Holds the erc 721 for basic listings
    mapping(address => mapping(uint256 => Listing_rent)) private r_listings;   // Holds the erc 4907 for rent listings _listingMap 

    mapping(address => uint256) private s_proceeds;
    
    mapping(address => EnumerableSet.UintSet) private s_address_tokens; // maps buy sell nft contracts to set of the tokens that are listed
    mapping(address => EnumerableSet.UintSet) private r_address_tokens; // maps rent nft contracts to set of the tokens that are listed

    EnumerableSet.AddressSet private s_address; // tracks the rent nft contracts that have been listed
    EnumerableSet.AddressSet private r_address; // tracks the rent nft contracts that have been listed

    Counters.Counter private s_listed;
    Counters.Counter private r_listed;


    modifier notSListed( // Modifier to check whether a given erc721 token is not listed or not
        address nftAddress,
        uint256 tokenId
    ) {
        Listing_sell memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier notRListed( // Modifier to check whether a given erc4907 token is not listed or not
        address nftAddress,
        uint256 tokenId
    ) {
        Listing_rent memory listing = r_listings[nftAddress][tokenId];
        if (listing.pricePerDay > 0) {
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

    modifier isRListed(address nftAddress, uint256 tokenId) {
        Listing_rent memory listing = r_listings[nftAddress][tokenId];
        if (listing.pricePerDay <= 0) {
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

    constructor() {
        _marketOwner = msg.sender;
    }

    // Listing Functionality

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external
        notSListed(nftAddress, tokenId)
    {
        require(isNFT(nftAddress), "Contract is not an ERC721");
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "Not owner of nft");
        require(price > 0, "listing price should be greater than 0");

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        s_listings[nftAddress][tokenId] = Listing_sell(msg.sender,nftAddress,tokenId,price);

        s_listed.increment();
        EnumerableSet.add(s_address_tokens[nftAddress], tokenId);
        EnumerableSet.add(s_address, nftAddress);

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 pricePerDay,
        uint256 startDateUNIX,
        uint256 endDateUNIX
    ) public payable 
        nonReentrant 
        notRListed(nftAddress, tokenId)
    {
        require(isRentableNFT(nftAddress), "Contract is not an ERC4907");
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "Not owner of nft");
        require(msg.value == _listingFee, "Not enough ether for listing fee");
        require(pricePerDay > 0, "Rental price should be greater than 0");
        require(startDateUNIX >= block.timestamp, "Start date cannot be in the past");
        require(endDateUNIX >= startDateUNIX, "End date cannot be before the start date");

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        payable(_marketOwner).transfer(_listingFee);

        r_listings[nftAddress][tokenId] = Listing_rent(
            msg.sender,
            address(0),
            nftAddress,
            tokenId,
            pricePerDay,
            startDateUNIX,
            endDateUNIX,
            0
        );

        r_listed.increment();
        EnumerableSet.add(r_address_tokens[nftAddress], tokenId);
        EnumerableSet.add(r_address, nftAddress);
        
        emit NFTListed(
            IERC721(nftAddress).ownerOf(tokenId),
            address(0),
            nftAddress,
            tokenId,
            pricePerDay,
            startDateUNIX,
            endDateUNIX,
            0
        );
    }


    // Unlisting functionality

    function cancelListing(                             // For erc721 listings
        address nftAddress, 
        uint256 tokenId
    ) external
        isOwner(nftAddress, tokenId, msg.sender)
        isSListed(nftAddress, tokenId)
    {
        delete s_listings[nftAddress][tokenId];

        EnumerableSet.remove(s_address_tokens[nftAddress], tokenId);

        if (EnumerableSet.length(s_address_tokens[nftAddress]) == 0) {
            EnumerableSet.remove(s_address, nftAddress);
        }
        s_listed.decrement();

        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function unlistNFT(                                 // for erc4907 listings
        address nftAddress, 
        uint256 tokenId
    ) public payable 
        nonReentrant 
        isOwner(nftAddress, tokenId, msg.sender)
        isRListed(nftAddress, tokenId)
    { 
        Listing_rent storage listing = r_listings[nftAddress][tokenId];

        uint256 refund = 0;
        if (listing.user != address(0)) {
            refund = ((listing.expires - block.timestamp) / 60 / 60 / 24 + 1) * listing.pricePerDay;
            require(msg.value >= refund, "Not enough ether to cover refund");
            payable(listing.user).transfer(refund);
        }
        // clean up data

        IERC4907(nftAddress).setUser(tokenId, address(0), 0);

        EnumerableSet.remove(r_address_tokens[nftAddress], tokenId);

        delete r_listings[nftAddress][tokenId];

        if (EnumerableSet.length(r_address_tokens[nftAddress]) == 0) {
            EnumerableSet.remove(r_address, nftAddress);
        }
        r_listed.decrement();

        emit NFTUnlisted(
            msg.sender,
            nftAddress,
            tokenId,
            refund
        );
    }

    // Buying and selling functionality

    function buyItem(           // Buy a nft listed in the s_listings map
        address nftAddress, 
        uint256 tokenId
    ) external payable
        isSListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing_sell memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.owner] += msg.value; // https://fravoll.github.io/solidity-patterns/pull_over_push.html

        delete s_listings[nftAddress][tokenId];

        EnumerableSet.remove(s_address_tokens[nftAddress], tokenId);

        if (EnumerableSet.length(s_address_tokens[nftAddress]) == 0) {
            EnumerableSet.remove(s_address, nftAddress);
        }
        s_listed.decrement();

        IERC721(nftAddress).safeTransferFrom(listedItem.owner, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    // Update already listed listings

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external
        isSListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        require(newPrice > 0, "listing price should be greater than 0");

        s_listings[nftAddress][tokenId].price = newPrice;

        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    // Withdraw Proceeds in the pull pattern. Used when multiple transactions are made within a single function

    function withdrawProceeds(

    ) external
    
    {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    // Getter Functions

    function getASListing(        // Get a specific s_listing
        address nftAddress, 
        uint256 tokenId
    ) external view
        returns (Listing_sell memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getARListing(        // Get a specific s_listing
        address nftAddress, 
        uint256 tokenId
    ) external view
        returns (Listing_rent memory)
    {
        return r_listings[nftAddress][tokenId];
    }

    function getProceeds(       // Get the proceeds available for a seller
        address seller
    ) external view 
        returns (uint256) 
    {
        return s_proceeds[seller];
    }

    function getRentListings(
    ) public view 
        returns (Listing_rent[] memory) 
    {
        Listing_rent[] memory listings = new Listing_rent[](r_listed.current());
        uint256 listingsIndex = 0;
        address[] memory nftContracts = EnumerableSet.values(r_address);

        for (uint i = 0; i < nftContracts.length; i++) {
            address nftAddress = nftContracts[i];
            uint256[] memory tokens = EnumerableSet.values(r_address_tokens[nftAddress]);
            for (uint j = 0; j < tokens.length; j++) {
                listings[listingsIndex] = r_listings[nftAddress][tokens[j]];
                listingsIndex++;
            }
        }
        return listings;
    }

    function getSellListings(
    ) public view 
        returns (Listing_sell[] memory) 
    {
        Listing_sell[] memory listings = new Listing_sell[](s_listed.current());
        uint256 listingsIndex = 0;
        address[] memory nftContracts = EnumerableSet.values(s_address);

        for (uint i = 0; i < nftContracts.length; i++) {
            address nftAddress = nftContracts[i];
            uint256[] memory tokens = EnumerableSet.values(s_address_tokens[nftAddress]);
            for (uint j = 0; j < tokens.length; j++) {
                listings[listingsIndex] = s_listings[nftAddress][tokens[j]];
                listingsIndex++;
            }
        }
        return listings;
    }

    function getListingFee(
    ) public view 
        returns (uint256) 
    {
        return _listingFee;
    }

    function getSListedAdddresses(
    ) public view 
        returns (address[] memory) 
    {
        address[] memory nftContracts = EnumerableSet.values(s_address);
        return nftContracts;
    }

    function getSListedAdddressTokens(
        address nftAddress
    ) public view 
        returns (uint256[] memory) 
    {
        uint256[] memory tokens = EnumerableSet.values(s_address_tokens[nftAddress]);
        return tokens;
    }

    function getRListedAdddresses(
    ) public view 
        returns (address[] memory) 
    {
        address[] memory nftContracts = EnumerableSet.values(r_address);
        return nftContracts;
    }

    function getRListedAdddressTokens(
        address nftAddress
    ) public view 
        returns (uint256[] memory) 
    {
        uint256[] memory tokens = EnumerableSet.values(r_address_tokens[nftAddress]);
        return tokens;
    }


    // start of the rental functions

    function rentNFT(
        address nftContract,
        uint256 tokenId,
        uint64 numDays
    ) public payable 
        nonReentrant 
    {
        Listing_rent storage listing = r_listings[nftContract][tokenId];
        require(listing.user == address(0) || block.timestamp > listing.expires, "NFT already rented");
        // require(expires <= listing.endDateUNIX, "Rental period exceeds max date rentable");
        // Transfer rental fee

        uint64 expires = uint64(block.timestamp) + (numDays*86400);
    
        uint256 rentalFee = listing.pricePerDay * numDays;
        require(msg.value >= rentalFee, "Not enough ether to cover rental period");
        payable(listing.owner).transfer(rentalFee);
        // Update listing
        IERC4907(nftContract).setUser(tokenId, msg.sender, expires);
        listing.user = msg.sender;
        listing.expires = expires;

        emit NFTRented(
            IERC721(nftContract).ownerOf(tokenId),
            msg.sender,
            nftContract,
            tokenId,
            listing.startDateUNIX,
            listing.endDateUNIX,
            expires,
            rentalFee
        );
    }


    function isRentableNFT(address nftContract) public view returns (bool) {
        bool _isRentable = false;
        bool _isNFT = false;
        try IERC165(nftContract).supportsInterface(type(IERC4907).interfaceId) returns (bool rentable) {
            _isRentable = rentable;
        } catch {
            return false;
        }
        try IERC165(nftContract).supportsInterface(type(IERC721).interfaceId) returns (bool nft) {
            _isNFT = nft;
        } catch {
            return false;
        }
        return _isRentable && _isNFT;
    }

    function isNFT(address nftContract) public view returns (bool) {
        bool _isNFT = false;

        try IERC165(nftContract).supportsInterface(type(IERC721).interfaceId) returns (bool nft) {
            _isNFT = nft;
        } catch {
            return false;
        }
        return _isNFT;
    }
}