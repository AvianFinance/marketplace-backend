const dbo = require("../database/conn");
const logger = require("../utils/logger")

const getOwned = async (req, res, next) => {
    try {
        const db = dbo.getDb();
        let query = { minter: req.params.userAdd }
        let result = await db.collection("nft_details").find(query).toArray();
        res.send(result).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

const getCollected = async (req, res, next) => {
    try {
        const db = dbo.getDb();
        let query = { owner: req.params.userAdd }
        let result = await db.collection("nft_details").find(query).toArray();
        res.send(result).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

const getRented = async (req, res, next) => {
    const db = dbo.getDb();
    let query = { token_type: "ERC4907", user: req.params.userAdd, expiry: { $ne: 0 } }
    try {
        let output = []
        let result = await db.collection("nft_details").find(query).toArray();
        if (result) {
            for (i in result) {
                let expires = parseInt(result[i].expiry._hex)
                let now = Date.now() / 1000
                if (expires > now) {
                    output.push(result[i])
                }
            }
        }
        // logger.info(JSON.stringify(output))
        res.send(output).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }

}

const getListed = async (req, res, next) => {
    const db = dbo.getDb();
    let query = { owner: req.params.userAdd, $or: [ { sell_listed_status: true }, { rent_listed_status: true }, { inst_listed_status: true } ] }
    try {
        let listed = await db.collection("nft_details").find(query).toArray();
        // console.log(listed)
        res.send(listed).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

const getCollections = async (req, res, next) => {
    const db = dbo.getDb();
    let collections = await db.collection("collections").find({ createdBy: req.params.userAdd }).toArray();

    for (i in collections) {
        let tokensList = await db.collection("nft_details").find({ coll_addr: collections[i]._id }).toArray();
        let result = []

        if (tokensList.length > 0) {
            let uriList = []
            for (token in tokensList) {
                uriList.push(tokensList[token].uri)
            }
            if (uriList.length > 4) {
                uriList = uriList.slice(0, 4)
            }
            collections[i].tokens = uriList
        }
    }
    res.send(collections).status(200)
}

const getLended = async (req, res, next) => {
    const db = dbo.getDb();
    let query = { token_type: "ERC4907", owner: req.params.userAdd, expiry: { $ne: 0 } }
    try {
        let output = []
        let result = await db.collection("nft_details").find(query).toArray();
        if (result) {
            for (i in result) {
                let expires = parseInt(result[i].expiry._hex)
                let now = Date.now() / 1000
                if (expires > now) {
                    output.push(result[i])
                }
            }
        }
        // logger.info(JSON.stringify(output))
        res.send(output).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

module.exports = {
    getOwned,
    getCollected,
    getRented,
    getCollections,
    getListed,
    getLended
}
