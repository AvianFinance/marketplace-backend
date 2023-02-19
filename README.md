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

### Buy explore routes

- GET - /api/buy/explore - get all collections for sell(Explore 1st page)
- GET - /api/buy/explore/:collectionAddress - get all tokens for collections

### Profile routes

- GET -   - rented ones


