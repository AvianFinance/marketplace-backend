const { MongoClient } = require("mongodb");
const {parentPort, workerData} = require("worker_threads");
const { itemBoughtEvent, itemListedEvent, nftListedEvent, nftRentedEvent, insNftListedEvent, insNftPaidEvent } = require('../controller/dbWorkerController')
const logger = require("../utils/logger")

const uri ="mongodb+srv://avfx_root:irmiot4462281@avianfinance.qc7bqtj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// async function insert(coll_name,doc) {
//     try {
//         await client.connect();
//         const collection = client.db("AVFX_Events").collection(coll_name);
//         const result = await collection.insertOne(doc);
//         logger.info(`A document was inserted with the _id: ${result.insertedId}`,);
//     } finally {
//         await client.close();
//     }
// }

const data_queue = [];

parentPort.on("message", msg => {
    data_queue.push(msg)
});

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function reader(){

    while (true){
        if (data_queue.length>0){
            let currentItem = data_queue.shift()

            if (currentItem.event == "ItemListed") {
                logger.info("Processing ItemListed Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await itemListedEvent(currentItem.data)
            }
            if (currentItem.event == "ItemCanceled") {
                logger.info("Processing ItemCanceled Event")
            }
            if (currentItem.event == "ItemBought") {
                logger.info("Processing ItemBought Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await itemBoughtEvent(currentItem.data)
            }
            if (currentItem.event == "NFTListed") {
                logger.info("Processing NFTListed Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await nftListedEvent(currentItem.data)
            }
            if (currentItem.event == "NFTUnlisted") {
                logger.info("Processing NFTUnlisted Event")
            }
            if (currentItem.event == "NFTRented") {
                logger.info("Processing NFTRented Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await nftRentedEvent(currentItem.data)
            }
            if (currentItem.event == "INSNFTListed") {
                logger.info("Processing INSNFTListed Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await insNftListedEvent(currentItem.data)
            }
            if (currentItem.event == "NFTINSPaid") {
                logger.info("Processing NFTINSPaid Event")
                logger.info(currentItem.data)
                logger.info("............................")
                await insNftPaidEvent(currentItem.data)
            }
        }else{
            await delay(2000)
        }
    }

}

reader()