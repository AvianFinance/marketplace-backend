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
 *         description: A list of collections with 4 token URIS.
 *         content:
 *           application/json:
 *              schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Document ID.
 *                         example: 1146F50Cf97A5B2b8D66bc5bfF93b86Cd3FF1f1
 *                       name:
 *                         type: string
 *                         description: Name of the collection.
 *                         example: Cricket Heroes
 *                       symbol:
 *                         type: string
 *                         description: Collection symbol.
 *                         example: ABC
 *                       tokenType:
 *                         type: string
 *                         description: Token type of the collection.
 *                         example: ERC721
 *                       tokens:
 *                         type: list
 *                         description: a list of token uris.
 *                         example: []
 *                       createdBy:
 *                         type: string
 *                         description: Creator of the collection.
 *                         example: ABC454545
 *                       count:
 *                         type: string
 *                         description: Number of tokens in the collection.
 *                         example: 4
 *                       createdUserName:
 *                         type: string
 *                         description: Username of the creator
 *                         example: add
 *                   
 *       500:
 *         description: Some server error
 *
 */

// returns all collections with 4 tokens with images
router.get('/explore', getBuyCollections);

/**
 * @swagger
 * tags:
 *   name: Buy
 *   description: Managing NFT Buying Marketplace
 * /buy/explore/{collectionID}:
 *   get:
 *     summary: Get all token details of a NFT collection
 *     tags: [Buy]
 *     parameters:
 *       - in: path
 *         name: collectionID
 *         required: true
 *         description: Collection address.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tokens of the given collection.
 *         content:
 *           application/json:
 *              schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Document ID.
 *                         example: 1146F50Cf97A5B2b8D66bc5bfF93b86Cd3FF1f1
 *                       coll_addr:
 *                         type: string
 *                         description: Address of the collection.
 *                         example: 2b8D66bc5bfF93b86Cd3FF1f1
 *                       token_id:
 *                         type: int
 *                         description: ID of the token.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the token.
 *                         example: Cricket Heroes
 *                       desc:
 *                         type: string
 *                         description: token decription.
 *                         example: ABC
 *                       tokenType:
 *                         type: string
 *                         description: Token type of the collection.
 *                         example: ERC721
 *                       uri:
 *                         type: string
 *                         description: image uri.
 *                         example: https://gateway.pi
 *                       owner:
 *                         type: string
 *                         description: owner of the token.
 *                         example: ABC454545
 *                       user :
 *                         type: string
 *                         description: user of the token.
 *                         example: 4
 *                       price:
 *                         type: string
 *                         description: Selling price of the token
 *                         example: add
 *                   
 *       500:
 *         description: Some server error
 *
 */
//returns details of all tokens inside the collection
router.get('/explore/:collectionId', getBuyCollectionTokens);

module.exports = router;
