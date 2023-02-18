const express = require('express');
const router = express.Router();

const { getBuyCollections, getBuyCollectionTokens } = require('../controller/buyController');

// returns all collections with 4 tokens with images
router.get('/explore',  getBuyCollections);
//returns details of all tokens inside the collection
router.get('/explore/:collectionId',  getBuyCollectionTokens );  

module.exports = router;