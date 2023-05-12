const dbo = require("../database/conn");
const logger = require("../utils/logger")

const getBasicInfo = async (req, res, next) => {
    try {
        const db = dbo.getDb();
        let nft_count = await db.collection("nft_details").count();
        let collections_count = await db.collection("collections").count();
        let users_count  = await db.collection("users").count();
        let result = {
            nft_count : nft_count,
            collections_count : collections_count, 
            users_count : users_count
        }
        res.send(result).status(200);
    } catch (err) {
        logger.error(err);
        next({ status: 500, message: err.message })
    }
}

module.exports = {
    getBasicInfo
}
