const express = require('express');
const router = express.Router();

const { getRentalCollections, getRentalCollectionTokens } = require('../controller/rentalController');

/**
 * @swagger
 * tags:
 *   name: Rent
 *   description: Managing NFT Buying Marketplace
 * /rental/explore:
 *   get:
 *     summary: Explore rental collections
 *     tags: [Rent]
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
router.get('/explore', getRentalCollections);

/**
 * @swagger
 * tags:
 *   name: Rent
 *   description: Managing NFT Buying Marketplace
 * /rental/explore/{collectionID}:
 *   get:
 *     summary: Get all token details of a NFT collection
 *     tags: [Rent]
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
 *                       uri:
 *                         type: string
 *                         description: image uri.
 *                         example: https://gateway.pi
 *                       owner:
 *                         type: string
 *                         description: owner of the token.
 *                         example: ABC454545
 *                       pricePerDay:
 *                         type: BigNumber
 *                         description: Selling price of the token
 *                         example: {}
 *                       startDateUNIX:
 *                         type: BigNumber
 *                         description: rent start period.
 *                         example: {}
 *                       endDateUNIX:
 *                         type: BigNumber
 *                         description: rent end period.
 *                         example: {}
 *                   
 *       500:
 *         description: Some server error
 *
 */

//returns details of all tokens inside the collection
router.get('/explore/:collectionId', getRentalCollectionTokens);


module.exports = router;
