const express = require('express');
const router = express.Router();

const { createCollection } = require('../controller/collectionController');

// returns all collections with 4 tokens with images
// router.get('/',  getRentalCollections);

router.post('/',  createCollection);

module.exports = router;