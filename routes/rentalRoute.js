const express = require('express');
const router = express.Router();

const { getRentalCollections, getRentalCollectionTokens } = require('../controller/rentalController');

// returns all collections with 4 tokens with images
router.get('/explore',  getRentalCollections);
//returns details of all tokens inside the collection
router.get('/explore/:collectionId',  getRentalCollectionTokens);  


module.exports = router;