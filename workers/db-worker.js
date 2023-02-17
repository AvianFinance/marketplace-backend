const { MongoClient } = require("mongodb");
const {parentPort, workerData} = require("worker_threads");

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
            await insert("rentals",data_queue.shift())
        }else{
            await delay(2000)
        }
    }

}

reader()