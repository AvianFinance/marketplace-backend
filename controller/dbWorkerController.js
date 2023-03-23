const config = require("../config/app-config")
const { MongoClient } = require("mongodb");
const logger = require('../utils/logger')
const db_name = config.db_name

const uri = config.db_connection
const client = new MongoClient(uri);

async function itemListedEvent(data) {
    try {
        const document = {
            seller: data.seller,
            nftAddress: data.nftAddress,
            tokenId: parseInt(data.tokenId._hex),
            price: data.price,
            event: "LIST-SELL",
            listed_status : true,
            sold_status: false,
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}`)

        const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { sell_listed_status: true }
        };

        await client.connect();
        const collection = client.db(db_name).collection("sell_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`,);

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(JSON.stringify(result1))

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result2.insertedId}`,);

    } catch (err) {
        logger.info("Error inserting data")
        logger.error(err)
    } finally {
        await client.close();
    }
}

async function itemBoughtEvent(data) {
    try {
        const document = {
            nftAddress: data.nftAddress,
            tokenId: parseInt(data.tokenId._hex),
            price: data.price,
            buyer: data.buyer,
            event: "BUY",
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}]`)

        // const query = { nftAddress: data.nftAddress, tokenId: parseInt(data.tokenId._hex), event: "LIST-SELL" };
        const query = { nftAddress: data.nftAddress, tokenId: parseInt(data.tokenId._hex), listed_status: true, sold_status: false };
        const updates = {
            $set: { listed_status: false, sold_status: true }
        };

        const query1 = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { owner: data.buyer, sell_listed_status: false }
        };
        await client.connect();

        // const collection = client.db(db_name).collection("sell_listings");
        // const result = await collection.deleteOne(query)
        // logger.info("Document deletion successful")

        const collection = client.db(db_name).collection("sell_listings");
        const result = await collection.updateOne(query, updates);
        logger.info(JSON.stringify(result))

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(result1)

        const collection2 = client.db(db_name).collection("market_events");
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
    try {
        const document = {
            owner: data.owner,
            user: data.user,
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            pricePerDay: data.pricePerDay,
            expires: data.expires,
            event: "LIST-RENT",
            type: "UPRIGHT",
            listed_status : true,
            rent_status: false,
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}]`)

        const query = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { rent_listed_status: true }
        };

        await client.connect();
        const collection = client.db(db_name).collection("rental_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`);

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(JSON.stringify(result1))

        const collection2 = client.db(db_name).collection("market_events");
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
    try {
        const document = {
            owner: data.owner,
            user: data.user,
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            rentalFee: data.rentalFee,
            expires: data.expires,
            event: "RENT",
            type: "UPRIGHT",
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}]`)

        // const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), event: "LIST-RENT" };
        const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), listed_status : true, rent_status: false};
        const updates = {
            $set: { listed_status: false, rent_status: true }
        };

        const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { user: data.user, expiry: data.expires, rent_listed_status: false }
        };

        await client.connect();
        // const collection = client.db(db_name).collection("rental_listings");
        // const result = await collection.deleteOne(query)
        // logger.info("Document deletion successful")

        const collection = client.db(db_name).collection("rental_listings");
        const result = await collection.updateOne(query, updates);
        logger.info(JSON.stringify(result))

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(JSON.stringify(result1))

        const collection2 = client.db(db_name).collection("market_events");
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
    try {
        const document = {
            owner: data.owner,
            user: data.user,
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            pricePerDay: data.pricePerDay,
            event: "LIST-INST",
            type: "INST",
            listed_status : true,
            inst_status: "LISTED",
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}]`)

        const query = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { inst_listed_status: true }
        };

        await client.connect();
        const collection = client.db(db_name).collection("inst_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document was inserted with the _id: ${result.insertedId}`);

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(JSON.stringify(result1))

        const collection2 = client.db(db_name).collection("market_events");
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
    try {
        //TODO: Get tot installement count from data
        const document = {
            owner: data.owner,
            user: data.user,
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            expires: data.expires,
            totInsCount: 5,
            ins_index: data.ins_index,
            amountIns: data.amountIns,
            paidIns: data.paidIns,
            event: "RENT",
            type: "INST",
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        logger.info(`Document to be inserted : [${JSON.stringify(document)}]`)

        const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), listed_status : true, inst_status: "LISTED"};
        const updates = {
            $set: { listed_status: false, inst_status: "PAYING" }
        };

        const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { user: data.user, expiry: data.expires, inst_listed_status: false }
        };
        await client.connect();
        
        const installment = await client.db(db_name).collection("nft_details").findOne(query1);
        logger.info(JSON.stringify(installment));

        if (installment.inst_listed_status == true) {

            const collection = client.db(db_name).collection("inst_listings");
            const result = await collection.updateOne(query, updates);
            logger.info(JSON.stringify(result))

            const collection1 = client.db(db_name).collection("nft_details");
            const result1 = await collection1.updateOne(query1, updates1);
            logger.info(JSON.stringify(result1))

            const collection2 = client.db(db_name).collection("market_events");
            const result2 = await collection2.insertOne(document);
            logger.info(`A document was inserted with the _id: ${result2.insertedId}`);
        }

        if (installment.inst_listed_status == false) {
            console.log("This is other installment pay")
            const collection2 = client.db(db_name).collection("market_events");
            const result2 = await collection2.insertOne(document);
            logger.info(`A document was inserted with the _id: ${result2.insertedId}`);

            const update = client.db(db_name).collection("nft_details").updateOne(query1, {expiry: data.expires})
            logger.info(JSON.stringify(update))
        }

        //TODO: replace 5 with request data
        if(parseInt(data.ins_index._hex) == 5){
            const u_query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), inst_status: "PAYING"};
            const collection = client.db(db_name).collection("inst_listings").updateOne(u_query , {inst_status: "COMPLETED"});
        }
    } catch (e) {
        logger.info("Error Updating database!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

module.exports = {
    itemBoughtEvent,
    itemListedEvent,
    nftListedEvent,
    nftRentedEvent,
    insNftListedEvent,
    insNftPaidEvent
}
