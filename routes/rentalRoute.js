const express = require('express');
const router = express.Router();
const Rental  = require('../model/Rental');

const dbo = require("../database/conn");
const { getRentals } = require('../controller/rentalController');

// router.get('/',  getRentals);

router.get('/all', (req, res) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("rentals")
        .find({}).limit(50)
        .toArray(function (err, result) {
        if (err) {
            res.status(400).send("Error fetching listings!");
        } else {
            res.json(result);
        }
        });
});

module.exports = router;