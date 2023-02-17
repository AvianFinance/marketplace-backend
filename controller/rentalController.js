const Rental = require('../model/Rental')
const db = require('../database/conn')

// @desc Get the rentals
// @route GET /api/rental/
const getRentals = async (req, res) => {
    let collection = await db.collection("posts");
    let results = await collection.find({})
      .limit(50)
      .toArray();
  
    res.send(results).status(200);
}

module.exports = { 
    getRentals, 
}