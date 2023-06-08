const {parentPort, workerData} = require("worker_threads");
const { itemBoughtEvent, itemListedEvent, nftListedEvent, nftRentedEvent, insNftListedEvent, insNftPaidEvent, ImplUpgradeEvent } = require('../controller/dbWorkerController')
const logger = require("../utils/logger")

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
                logger.info("Processing ItemListed Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await itemListedEvent(currentItem.data)
            }
            if (currentItem.event == "ImplUpgrade") {
                logger.info("Processing ImplUpgrade Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await ImplUpgradeEvent(currentItem.data)
            }
            if (currentItem.event == "ItemCanceled") {
                logger.info("Processing ItemCanceled Event......")
                logger.info(JSON.stringify(currentItem.data))
                logger.warn("Logic not implemented")
                logger.info(JSON.stringify(currentItem.data))
            }
            if (currentItem.event == "ItemBought") {
                logger.info("Processing ItemBought Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await itemBoughtEvent(currentItem.data)
            }
            if (currentItem.event == "NFTListed") {
                logger.info("Processing NFTListed Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await nftListedEvent(currentItem.data)
            }
            if (currentItem.event == "NFTUnlisted") {
                logger.info("Processing NFTUnlisted Event.....")
                logger.info(JSON.stringify(currentItem.data))
                logger.warn("Logic not implemented")
                logger.info(JSON.stringify(currentItem.data))
            }
            if (currentItem.event == "NFTRented") {
                logger.info("Processing NFTRented Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await nftRentedEvent(currentItem.data)
            }
            if (currentItem.event == "INSNFTListed") {
                logger.info("Processing INSNFTListed Event.....")
                logger.info(JSON.stringify(currentItem.data))
                await insNftListedEvent(currentItem.data)
            }
            if (currentItem.event == "NFTINSPaid") {
                logger.info("Processing NFTINSPaid Event......")
                logger.info(JSON.stringify(currentItem.data))
                await insNftPaidEvent(currentItem.data)
            }
        }else{
            await delay(2000)
        }
    }
}

reader()