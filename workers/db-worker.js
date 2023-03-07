const { MongoClient } = require("mongodb");
const {parentPort, workerData} = require("worker_threads");
const { itemBoughtEvent, itemListedEvent, nftListedEvent, nftRentedEvent } = require('../controller/dbWorkerController')

const uri ="mongodb+srv://avfx_root:irmiot4462281@avianfinance.qc7bqtj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function insert(coll_name,doc) {
    try {
        await client.connect();
        const collection = client.db("AVFX_Events").collection(coll_name);
        const result = await collection.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`,);
    } finally {
        await client.close();
    }
}

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
                console.log("Processing ItemListed Event")
                await itemListedEvent(currentItem.data)
            }
            if (currentItem.event == "ItemCanceled") {
                console.log("Processing ItemCanceled Event")
            }
            if (currentItem.event == "ItemBought") {
                console.log("Processing ItemBought Event")
                console.log(currentItem.data)
                console.log("............................")
                await itemBoughtEvent(currentItem.data)
            }
            if (currentItem.event == "NFTListed") {
                console.log("Processing NFTListed Event")
                console.log(currentItem.data)
                console.log("............................")
                await nftListedEvent(currentItem.data)
            }
            if (currentItem.event == "NFTUnlisted") {
                console.log("Processing NFTUnlisted Event")
            }
            if (currentItem.event == "NFTRented") {
                console.log("Processing NFTRented Event")
                console.log(currentItem.data)
                console.log("............................")
                await nftRentedEvent(currentItem.data)
            }
        }else{
            await delay(2000)
        }
    }

}

reader()