const config = require("../config/app-config")
const { MongoClient } = require("mongodb");
const logger = require('../utils/logger')
const db_name = config.db_name

const uri = config.db_connection
const client = new MongoClient(uri);

async function itemListedEvent(data) {
    try {
        await client.connect();

        //Insert to sell_listing
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

        const collection = client.db(db_name).collection("sell_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document inserted to sell_listings with the _id: ${result.insertedId}`,);

        //Update NFT details
        const query = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { sell_listed_status: true }
        };

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

        //Add to market events
        const event = {
            nftContract: data.nftAddress,
            tokenId: parseInt(data.tokenId._hex),
            event: "List [Sell]",
            from: data.seller,
            to: "",
            price: data.price,
            createdAt: new Date()
        };

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(event);
        logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`,);

    } catch (err) {
        logger.info("Error inserting data")
        logger.error(err)
    } finally {
        await client.close();
    }
}

async function itemBoughtEvent(data) {
    try {
        await client.connect();

        //Update sell listing status
        const query = { nftAddress: data.nftAddress, tokenId: parseInt(data.tokenId._hex), listed_status: true, sold_status: false };
        const updates = {
            $set: { listed_status: false, sold_status: true }
        };

        const collection = client.db(db_name).collection("sell_listings");
        const result = await collection.updateOne(query, updates);
        logger.info(`sell_listings Update result: ${JSON.stringify(result)}`)

        // Update NFT details
        const query1 = { coll_addr: data.nftAddress, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { owner: data.buyer, sell_listed_status: false }
        };
        
        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

        //Update market events
        //TODO: Get from adress as seller
        const event = {
            nftContract: data.nftAddress,
            tokenId: parseInt(data.tokenId._hex),
            event: "Buy",
            from: "",
            to: data.buyer,
            price: data.price,
            createdAt: new Date()
        };

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(event);
        logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`,);

    } catch (e) {
        logger.info("Error Updating database!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function nftListedEvent(data) {
    try {
        await client.connect();

        //Insert to rent listings 
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

        const collection = client.db(db_name).collection("rental_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document inserted to rental_listings with the _id: ${result.insertedId}`);

        //Update nft_details
        const query = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { rent_listed_status: true }
        };

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

        //Insert to market events
        const event = {
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            event: "List [Upright Rent]",
            from: data.owner,
            to: "",
            price: data.pricePerDay,
            createdAt: new Date()
        };

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(event);
        logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error inserting data!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function nftRentedEvent(data) {
    try {
        await client.connect();

        //Update rental listing status
        const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), listed_status : true, rent_status: false};
        const updates = {
            $set: { listed_status: false, rent_status: true }
        };

        const collection = client.db(db_name).collection("rental_listings");
        const result = await collection.updateOne(query, updates);
        logger.info(`rental_listings Update result: ${JSON.stringify(result)}`)

        //Update nft details
        const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { user: data.user, expiry: data.expires, rent_listed_status: false }
        };

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query1, updates1);
        logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

        //Add to market events
        const event = {
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            event: "Rent [Upright]",
            from: data.owner,
            to: data.user,
            price: data.rentalFee,
            createdAt: new Date()
        };

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(event);
        logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error Updating database!")
        logger.info(e)
    } finally {
        await client.close();
    }
}

async function insNftListedEvent(data) {
    try {
        await client.connect();

        //Add to Installement NFT listing
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

        const collection = client.db(db_name).collection("inst_listings");
        const result = await collection.insertOne(document);
        logger.info(`A document inserted to inst_listings the _id: ${result.insertedId}`);

        //Update NFT details
        const query = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates = {
            $set: { inst_listed_status: true }
        };

        const collection1 = client.db(db_name).collection("nft_details");
        const result1 = await collection1.updateOne(query, updates);
        logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

        //Add to market events
        const event = {
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            event: "List [Installment Rent]",
            from: data.owner,
            to: "",
            price: data.pricePerDay,
            createdAt: new Date()
        };

        const collection2 = client.db(db_name).collection("market_events");
        const result2 = await collection2.insertOne(event);
        logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`);

    } catch (e) {
        logger.info("Error inserting data!")
        logger.error(e)
    } finally {
        await client.close();
    }
}

async function insNftPaidEvent(data) {
    try {
        await client.connect();

        const query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), listed_status : true, inst_status: "LISTED"};
        const updates = {
            $set: {user: data.user, listed_status: false, inst_status: "PAYING" }
        };

        const query1 = { coll_addr: data.nftContract, token_id: parseInt(data.tokenId._hex) };
        const updates1 = {
            $set: { user: data.user, expiry: data.expires, inst_listed_status: false }
        };
        
        //Get one nft detail to check the listing status
        const installment = await client.db(db_name).collection("nft_details").findOne(query1);
        logger.info(JSON.stringify(installment));

        const event = {
            nftContract: data.nftContract,
            tokenId: parseInt(data.tokenId._hex),
            event: "Paid [Installment Rent]",
            from: data.user,
            to: data.owner,
            price: data.insAmount,
            createdAt: new Date()
        };

        if (installment.inst_listed_status == true) {
            logger.info("Rent NFT processing...")

            // update installment listing
            const collection = client.db(db_name).collection("inst_listings");
            const result = await collection.updateOne(query, updates);
            logger.info(`inst_listings Update result: ${JSON.stringify(result)}`)

            //update nft_details
            const collection1 = client.db(db_name).collection("nft_details");
            const result1 = await collection1.updateOne(query1, updates1);
            logger.info(`nft_details Update result: ${JSON.stringify(result1)}`)

            //Insert to market events
            const collection2 = client.db(db_name).collection("market_events");
            const result2 = await collection2.insertOne(event);
            logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`);
        }

        if (installment.inst_listed_status == false) {
            logger.info("Next installment pay processing...")

            //Insert to market events
            const collection2 = client.db(db_name).collection("market_events");
            const result2 = await collection2.insertOne(event);
            logger.info(`A document inserted to market_events with the _id: ${result2.insertedId}`);

            //Update nft details with expiry
            const update = await client.db(db_name).collection("nft_details").updateOne(query1, {expiry: data.expires})
            logger.info(`nft_details Update result: ${JSON.stringify(update)}`)
        }

        // Update status if the installment is paid
        if(parseInt(data.insIndex._hex) == parseInt(data.insCount._hex)){
            const u_query = { nftContract: data.nftContract, tokenId: parseInt(data.tokenId._hex), inst_status: "PAYING"};
            const collection = await client.db(db_name).collection("inst_listings").updateOne(u_query , {inst_status: "COMPLETED"});
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
