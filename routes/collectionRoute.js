const express = require('express');
const router = express.Router();

const { createCollection, getCollectionByID } = require('../controller/collectionController');

// returns all collections with 4 tokens with images
// router.get('/',  getRentalCollections);

router.post('/',  createCollection);
router.get('/:userAddress',  getCollectionByID);

module.exports = router;