
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


contract AvianInstallment is ReentrancyGuard {

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;
    
    
    address private _marketOwner;
    uint256 private _listingFee = .001 ether;
    uint64 private _maxInstallments = 10;


    struct Listing_installment { 
        address owner;
        address user;
        address nftContract;
        uint256 tokenId;
        uint256 pricePerDay;
        uint64 installmentCount;
        uint64 expires;
        uint64 installmentIndex;
        uint256 paidIns;
    }


    event INSNFTListed(
        address indexed owner,
        address indexed user,
        address indexed nftContract,
        uint256 tokenId,
        uint256 pricePerDay
    );

    event NFTINSPaid(
        address indexed owner,
        address indexed user,
        address indexed nftContract,
        uint256 tokenId,
        uint64 expires,
        uint64 ins_index,
        uint256 amountIns,
        uint256 paidIns
    );

    event NFTUnlisted(
        address indexed unlistSender,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    // mapping for basics

    mapping(address => mapping(uint256 => Listing_installment)) private i_listings;   // Holds the erc 4907 for installment based rentings

    mapping(address => EnumerableSet.UintSet) private i_address_tokens; // maps installment based rent nft contracts to set of the tokens that are listed

    EnumerableSet.AddressSet private i_address; // tracks the ins basede rent nft contracts that have been listed

    Counters.Counter private i_listed;


    modifier notIListed( // Modifier to check whether a given erc4907 token is not listed or not for installment based
        address nftAddress,
        uint256 tokenId
    ) {
        Listing_installment memory listing = i_listings[nftAddress][tokenId];
        if (listing.pricePerDay > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isIListed(address nftAddress, uint256 tokenId) {
        Listing_installment memory listing = i_listings[nftAddress][tokenId];
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

    function listInsBasedNFT( // installment based
        address nftAddress,
        uint256 tokenId,
        uint256 pricePerDay
    ) public payable 
        nonReentrant 
        notIListed(nftAddress, tokenId)
    {
        require(isRentableNFT(nftAddress), "Contract is not an ERC4907");
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "Not owner of nft");
        require(msg.value == _listingFee, "Not enough ether for listing fee");
        require(pricePerDay > 0, "Rental price should be greater than 0");

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }

        payable(_marketOwner).transfer(_listingFee);

        i_listings[nftAddress][tokenId] = Listing_installment(
            msg.sender,
            address(0),
            nftAddress,
            tokenId,
            pricePerDay,
            0,
            0,
            0,
            0
        );

        i_listed.increment();
        EnumerableSet.add(i_address_tokens[nftAddress], tokenId);
        EnumerableSet.add(i_address, nftAddress);
        
        emit INSNFTListed(
            IERC721(nftAddress).ownerOf(tokenId),
            address(0),
            nftAddress,
            tokenId,
            pricePerDay
        );
    }


    // Unlisting functionality

    function unlistINSNFT(                              
        address nftAddress, 
        uint256 tokenId
    ) public
        isOwner(nftAddress, tokenId, msg.sender)
        isIListed(nftAddress, tokenId)
    { 
        EnumerableSet.remove(i_address_tokens[nftAddress], tokenId);

        delete i_listings[nftAddress][tokenId];

        if (EnumerableSet.length(i_address_tokens[nftAddress]) == 0) {
            EnumerableSet.remove(i_address, nftAddress);
        }
        i_listed.decrement();

        emit NFTUnlisted(
            msg.sender,
            nftAddress,
            tokenId
        );
    }


    function getAInsListing(        // Get a specific s_listing
        address nftAddress, 
        uint256 tokenId
    ) external view
        returns (Listing_installment memory)
    {
        return i_listings[nftAddress][tokenId];
    }

    function getListingFee(
    ) public view 
        returns (uint256) 
    {
        return _listingFee;
    }

    function getInsListedAdddresses(
    ) public view 
        returns (address[] memory) 
    {
        address[] memory nftContracts = EnumerableSet.values(i_address);
        return nftContracts;
    }

    function getInsListedAdddressTokens(
        address nftAddress
    ) public view 
        returns (uint256[] memory) 
    {
        uint256[] memory tokens = EnumerableSet.values(i_address_tokens[nftAddress]);
        return tokens;
    }


    // start of the rental functions


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

    //-----------------------------------------

    function rentINSNFT(
        address nftContract,
        uint256 tokenId,
        uint64 numDays
    ) public payable 
        nonReentrant 
    {
        require(numDays <= _maxInstallments, "Maximum of 10 rental days are allowed");
        require(numDays > 1, "Number of installments must be greater than 1");

        Listing_installment storage listing = i_listings[nftContract][tokenId];

        require(listing.user == address(0) || block.timestamp > listing.expires, "NFT already rented");

        uint64 expires = uint64(block.timestamp) + 86400;
        
        uint256 firstIns = calculateInstallment(0,numDays,listing.pricePerDay,1);

        require(msg.value >= firstIns, "Not enough ether to cover rental period");
        payable(listing.owner).transfer(firstIns);

        // Update listing
        IERC4907(nftContract).setUser(tokenId, msg.sender, expires);
        listing.user = msg.sender;
        listing.expires = expires;
        listing.installmentCount = numDays;
        listing.installmentIndex = 1;
        listing.paidIns = firstIns;

        emit NFTINSPaid(
            IERC721(nftContract).ownerOf(tokenId),
            msg.sender,
            nftContract,
            tokenId,
            expires,
            1,
            firstIns,
            firstIns
        );
    }


    function calculateInstallment(
        uint256 totalPaid,
        uint256 installmentCount,
        uint256 pricePerDay,
        uint installmentIndex
    ) private pure
        returns (uint256) 
    {
        require(installmentIndex <= installmentCount, "Installment Index should be lesser than the installment count");
        require(installmentIndex > 0, "Installment Index should be greater than 0");

        uint256 rentalFee = pricePerDay*installmentCount;

        uint256 installment_amount;
        uint sum = 0;

        for (uint i = 1; i <= installmentCount; i++) {
            sum = sum + i;
        }
        uint256 unit_price = rentalFee/sum;

        if (installmentIndex<installmentCount){
            installment_amount = unit_price*(installmentCount - installmentIndex +1);
        } else if (installmentIndex==installmentCount){
            installment_amount = rentalFee - totalPaid;
        }

        return installment_amount;
    }

    function getNftInstallment(
        address nftAddress,
        uint256 tokenId,
        uint64 installmentCount
    ) public view 
        returns (uint256) 
    {

        Listing_installment storage listing = i_listings[nftAddress][tokenId];

        if (listing.installmentCount>0){
            installmentCount = listing.installmentCount;
        }

        uint256 nextIns = 0;

        if (listing.installmentCount==listing.installmentIndex){
            nextIns = calculateInstallment(0,installmentCount,listing.pricePerDay,1);
        }else {
            uint64 currIndex = listing.installmentIndex;
            uint64 nextIndex = currIndex + 1;
            nextIns = calculateInstallment(listing.paidIns,installmentCount,listing.pricePerDay,nextIndex);
        }

        return nextIns;
    }


    function payNFTIns(
        address nftContract,
        uint256 tokenId
    ) public payable 
        nonReentrant 
    {
        Listing_installment storage listing = i_listings[nftContract][tokenId];

        require(listing.user == msg.sender, "You are not the current renter");
        require(listing.installmentIndex < listing.installmentCount, "Rental fee is fully paid");
        require(listing.installmentIndex >= 1, "Rental agreement not yet made");
        require(block.timestamp < listing.expires, "NFT expired");

        uint64 expires = listing.expires + 86400;
        uint64 currIndex = listing.installmentIndex;
        uint64 nextIndex = currIndex + 1;
        
        uint256 nextIns = calculateInstallment(listing.paidIns,listing.installmentCount,listing.pricePerDay,nextIndex);

        require(msg.value >= nextIns, "Not enough ether to cover rental period");
        payable(listing.owner).transfer(nextIns);

        listing.expires = expires;

        IERC4907(nftContract).setUser(tokenId, msg.sender, expires);

        uint256 totalPaid = listing.paidIns + nextIns;

        listing.installmentIndex = nextIndex;
        listing.paidIns = totalPaid;


        emit NFTINSPaid(
            IERC721(nftContract).ownerOf(tokenId),
            msg.sender,
            nftContract,
            tokenId,
            expires,
            currIndex,
            nextIns,
            totalPaid
        );
    }
}