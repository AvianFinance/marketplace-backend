const dbo = require("../database/conn");
const { MongoClient } = require("mongodb");

const uri ="mongodb+srv://avfx_root:irmiot4462281@avianfinance.qc7bqtj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function itemListedEvent(data) {
    const priceS = ( parseInt(data.price._hex, 16) * 10 ** -18 ).toString()
    
    const document = {
        seller: data.seller,
        nftAddress: data.nftAddress,
        tokenId: parseInt(data.tokenId._hex),
        price : priceS,
        buyer: "",
        status: "LISTED",                                      
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    console.log(document)

    const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates = {
      $set: { listed_status : true }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("sell_listings");
        const result = await collection.insertOne(document);
        console.log(`A document was inserted with the _id: ${result.insertedId}`,);

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        console.log(result1)

    } catch(e) {
        console.log("Error inserting data")
        console.log(e)
    } finally {
        await client.close();
    }
}

// @desc Get single user
async function itemBoughtEvent(data) {
    console.log(data)

    const query = { nftAddress: data.nftAddress, tokenId: parseInt(data.tokenId._hex), status: "LISTED" };
    const updates = {
      $set: {status: "SOLD", buyer: data.buyer}
    };

    const query1 = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates1 = {
      $set: {owner: data.buyer}
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("sell_listings");
        const result = await collection.updateOne(query, updates);
        console.log(`A document updated with the _id: ${result.upsertedId}`);
        console.log(result)

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        console.log(`A document updated with the _id: ${result1.upsertedId}`);
        console.log(result1)
  
    } catch(e) {
        console.log("Error Updating database!")
        console.log(e)
    } finally {
        await client.close();
    }
}

// @desc Get single user
async function nftListedEvent(data) {
    //console.log(data)

    // const priceS = ( parseInt(data.price._hex, 16) * 10 ** -18 ).toString()
    // console.log(priceS)
    
    const document = {
        owner: data.owner,
        user: data.user,
        nftContract: data.nftContract, 
        tokenId: parseInt(data.tokenId._hex), 
        pricePerDay: data.pricePerDay, 
        startDateUNIX: data.startDateUNIX, 
        endDateUNIX: data.endDateUNIX, 
        expires: data.expires,
        status: "LISTED",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    console.log(document)

    const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates = {
      $set: { listed_status : true }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("rental_listings");
        const result = await collection.insertOne(document);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        console.log(result1)

    } catch(e) {
        console.log("Error inserting data!")
        console.log(e)
    } finally {
        await client.close();
    }
}

// @desc Get single user
async function nftRentedEvent(data) {
    console.log(data)

    const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), status: "LISTED" };
    const updates = {
      $set: {status: "RENTED", user: data.user, expires: data.expires}
    };

    const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
    const updates1 = {
      $set: {user: data.user, expiry: data.expires}
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("rental_listings");
        const result = await collection.updateOne(query, updates);
        console.log(`A document updated with the _id: ${result.upsertedId}`);
        console.log(result)

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        console.log(`A document updated with the _id: ${result1.upsertedId}`);
        console.log(result1)
  
    } catch(e) {
        console.log("Error Updating database!")
        console.log(e)
    } finally {
        await client.close();
    }
}

module.exports = { 
    createSellListing,
    itemBought,
    nftRented,
    nftListed,
    itemBoughtEvent,
    itemListedEvent,
    nftListedEvent,
    nftRentedEvent
}