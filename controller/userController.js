const dbo = require("../database/conn");
const logger = require("../utils/logger");

// @desc Get single user
// @route GET /api/user/:id"
const getUserById = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("users");
    let query = { _id: req.params.id };
    let result = await collection.findOne(query);
    if (!result) {
        res.statusCode = 404;
        res.end('Not Found');
    } else {
        res.send(result).status(200);
    }
}

// @desc User loggin
// @route GET /api/user/login/:id"
const loggedUser = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("users");
    let query = { _id: req.params.id };
    let result = await collection.findOne(query);

    if (!result) {
        const userDocument = {
            _id: req.params.id,
            name: "Unknown",
            bio: "",
            email: "",
            twitterLink: "",
            instaLink: "",
            site: "",
            profileImage: "https://res.cloudinary.com/isuruieee/image/upload/v1676639701/00073_ysx5m1.png",
            coverImage: "https://res.cloudinary.com/isuruieee/image/upload/v1676640391/WhatsApp_Image_2023-02-17_at_18.56.00_wjszpo.jpg",
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        let create = await collection.insertOne(userDocument);
        let userCreated = { _id: create.insertedId };
        let user = await collection.findOne(userCreated);
        logger.info("New user Created!")
        logger.info(JSON.stringify(user))
        res.send(user).status(201);
    } else {
        res.send(result).status(200);
    }
}

// @desc Update User
// @route GET /api/user/:id"
const updateUser = async (req, res) => {
    const db = dbo.getDb();
    const query = { _id: req.params.id };
    logger.info(req.body)
    const updates = {
        $set: req.body
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
}

async function getUserByAddress(userAdress) {
    const db = dbo.getDb();
    let collection = await db.collection("users");
    let query = { _id: userAdress };
    let result = await collection.findOne(query);
    return (result)
}

module.exports = {
    getUserById,
    loggedUser,
    updateUser,
    getUserByAddress
}
