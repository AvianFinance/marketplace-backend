const dbo = require("../database/conn");

// @desc Get single user
// @route GET /api/user/:id"
const getUserById = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("users");
    let query = {_id: req.params.id};
    let result = await collection.findOne(query);
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
}

// @desc User loggin
// @route GET /api/user/login/:id"
const loggedUser = async (req, res) => {
    const db = dbo.getDb();
    let collection = await db.collection("users");
    let query = {_id: req.params.id};
    let result = await collection.findOne(query);
  
    if (!result){
        const userDocument = {
            _id: req.params.id,
            name: "Unknown",
            bio: "",
            email: "",
            twitterLink: "",
            instaLink: "",
            site: "",
            profileImage: "",
            coverImage: "",
            createdAt: new Date(),
            modifiedAt: new Date(),
          };
        let create = await collection.insertOne(userDocument);
        let userCreated = {_id: create.insertedId};
        let user = await collection.findOne(userCreated);
        console.log("New user Created!")
        console.log(user)
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
    console.log(req.body)
    const updates = {
      $set: req.body
    };
    
    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    
    res.send(result).status(200);
}

module.exports = { 
    getUserById,
    loggedUser,
    updateUser
}