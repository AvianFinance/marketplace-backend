const express = require('express');
const router = express.Router();

const { getBuyCollections, getBuyCollectionTokens } = require('../controller/buyController');

/**
 * @swagger
 * tags:
 *   name: Buy
 *   description: Managing NFT Buying Marketplace
 * /buy/explore:
 *   get:
 *     summary: Explore buy collections
 *     tags: [Buy]
 *     responses:
 *       200:
 *         description: A collection with 4 token URIS.
 *         content:
 *           application/json:
 *    
 *       500:
 *         description: Some server error
 *
 */

// returns all collections with 4 tokens with images
router.get('/explore',  getBuyCollections);
//returns details of all tokens inside the collection
router.get('/explore/:collectionId',  getBuyCollectionTokens );  

module.exports = router;