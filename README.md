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
### Rental exlpore routes

- GET - /api/rental/explore - get all collections for rental(Explore 1st page)

### Buy explore routes

- GET - /api/buy/explore - get all collections for sell(Explore 1st page)

### Profile routes

- GET -   - rented ones


