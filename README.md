# NFT Marketplace Backend API

## How to run

1. npm install
2. Create a .env file at the working directory
```
    MONGODB_CONNECTION_STRING=XXXX
    PORT=XXXX
    AMPLACE_TOKEN = XXXX
    RIME_TOKEN  = XXXX
    RIME_RENT = XXXX
    INSMPLACE_TOKEN  = XXX
```
3. npm start

## Routes

### User Routes

- GET - /api/user/:id - Get user by ID
- GET - /api/user/login/:id - Get user when user loggin
- PUT - /api/user/:id - Update a user
```     
        {
            "name":"Unknown",
            "bio":"","email":"",
            "twitterLink":"",
            "instaLink":"",
            "site":"",
            "profileImage":"",
            "coverImage":""
        }
```

### Collection Routes

 - POST - /api/collection - create a new collection
 ```
        {
            "address" : "aaaabbbbbbb888888888",
            "name" : "collection1",
            "symbol" : "Col1",
            "tokenType" : "ERC721",
            "createdBy" : "666aaaaaaaaa"
        }
```

- GET - /api/collection/:userAddress - Get collections by user 

```
Response
        [{
            "_id": "0x333Fb230EBCAcaBF62049A68Ca441Ac5D938BBC3vv",
            "name": "Roses",
            "symbol": "RS",
            "tokenType": "ERC4907",
            "tokens": {},
            "createdBy": "0x8f2590Ad8fE67735aC2993841590a2eD1F58ACcE",
            "createdAt": "2023-02-19T05:48:02.585Z",
            "modifiedAt": "2023-02-19T05:48:02.585Z"
        }]
```


### Rental exlpore routes

- GET - /api/rental/explore - get all collections for rental(Explore 1st page)
- GET - /api/rental/explore/:collectionAddress - get all rental tokens for collections

### Buy explore routes

- GET - /api/buy/explore - get all collections for sell(Explore 1st page)
- GET - /api/buy/explore/:collectionAddress - get all tokens for collections

### Profile routes

- GET -  /api/profile/collected/:userAdd - collected nfts
- GET -  /api/profile/owned/:userAdd  - owned nfts
- GET -  /api/profile/collections/:userAdd  - collections 
- GET -  /api/profile/listed/:userAdd  - my listings
- GET -  /api/profile/lended/:userAdd  - lended
- GET -  /api/profile/rented/:userAdd  - rented by me 

### Mint Routes

- POST - /api/mint/ipfs  - upload to ipfs
```     
FormData
    collectionAddress - 0x71146F50Cf97A5B2b8D66bc5bfF93b86Cd3FF1f1
    image - image.png
    nftName - bear
    nftDescription - description

```
- POST - /api/mint - save nft details
```     
    {
        "coll_addr":"0x9B0365F4C6F086A871a5F2d4e2e86D290936Cd5B",
        "token_id":8,
        "name":"GOAT",
        "desc":"Anving fun",
        "uri":"https://gateway.pinata.cloud/ipfs/QmXWsVv1xGBPZPEZScB8keE4bbBVpHzLaMq8aDPHa28F4M",
        "minter" : "wallet_address"
    }

```

### Get NFT Details

- GET - /api/assets/CollectionId/tokenId - Get details of one NFT
    Eg - /api/assets/0x71146F50Cf97A5B2b8D66bc5bfF93b86Cd3FF1f1/1

### Code Formatiing

The code formatting is available in Visual Studio Code through the following shortcuts:

On Windows Shift + Alt + F
On Mac Shift + Option + F
On Linux Ctrl + Shift + I