const dbo = require("../database/conn");
const { MongoClient } = require("mongodb");
const logger = require('../utils/logger')

const uri = "mongodb+srv://avfx_root:irmiot4462281@avianfinance.qc7bqtj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function itemListedEvent(data) {
    const priceS = (parseInt(data.price._hex, 16) * 10 ** -18).toString()

    const document = {
        seller: data.seller,
        nftAddress: data.nftAddress,
        tokenId: parseInt(data.tokenId._hex),
        price: priceS,
        buyer: "",
        status: "LISTED",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    logger.info(document)

    const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates = {
        $set: { listed_status: true }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("sell_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`,);

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(result1)

        const collection2 = client.db("AVFX_Events").collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`,);

    } catch (e) {
        logger.info("Error inserting data")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function itemBoughtEvent(data) {

    const document = {
        nftAddress: data.nftAddress,
        tokenId: parseInt(data.tokenId._hex),
        price: data.price,
        buyer: data.buyer,
        status: "BOUGHT",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    logger.info(document)

    const query = { nftAddress: data.nftAddress, tokenId: parseInt(data.tokenId._hex), status: "LISTED" };

    const query1 = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates1 = {
        $set: { owner: data.buyer, listed_status: false }
    };

    try {
        await client.connect();

        const collection = client.db("AVFX_Events").collection("sell_listings");
        const result = await collection.deleteOne(query)
        logger.info("Document deletion successful")

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(result1)

        const collection2 = client.db("AVFX_Events").collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`,);

    } catch (e) {
        logger.info("Error Updating database!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function nftListedEvent(data) {
    //logger.info(data)

    // const priceS = ( parseInt(data.price._hex, 16) * 10 ** -18 ).toString()
    // logger.info(priceS)

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
        type: "UPRIGHT",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    logger.info(document)

    const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates = {
        $set: { listed_status: true }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("rental_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`);

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(result1)

        const collection2 = client.db("AVFX_Events").collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error inserting data!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function nftRentedEvent(data) {
    const document = {
        owner: data.owner,
        user: data.user,
        nftContract: data.nftContract,
        tokenId: parseInt(data.tokenId._hex),
        rentalFee: data.renatlFee,
        startDateUNIX: data.startDateUNIX,
        endDateUNIX: data.endDateUNIX,
        expires: data.expires,
        status: "RENTED",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    logger.info(document)

    const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), status: "LISTED" };

    const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
    const updates1 = {
        $set: { user: data.user, expiry: data.expires, listed_status }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("rental_listings");
        const result = await collection.deleteOne(query)
        logger.info("Document deletion successful")

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(result1)

        const collection2 = client.db("AVFX_Events").collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error Updating database!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function insNftListedEvent(data) {

    const document = {
        owner: data.owner,
        user: data.user,
        nftContract: data.nftContract,
        tokenId: parseInt(data.tokenId._hex),
        pricePerDay: data.pricePerDay,
        status: "LISTED",
        type: "INST",
        createdAt: new Date(),
        modifiedAt: new Date(),
    };
    logger.info(`Saving document ${document}`)

    const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
    const updates = {
        $set: { listed_status: true }
    };

    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection("rental_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`);

        const collection1 = client.db("AVFX_Events").collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(result1)

        const collection2 = client.db("AVFX_Events").collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error inserting data!")
        logger.error(e)
    } finally {
        await client.close();
    }
}

async function insNftPaidEvent(data) {

}

module.exports = {
    itemBoughtEvent,
    itemListedEvent,
    nftListedEvent,
    nftRentedEvent,
    insNftListedEvent,
    insNftPaidEvent
}
