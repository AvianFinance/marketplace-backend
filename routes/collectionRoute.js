const express = require('express');
const router = express.Router();

const { createCollection, getCollectionByID, createWrapperCollection } = require('../controller/collectionController');

// returns all collections with 4 tokens with images
// router.get('/',  getRentalCollections);

/**
 * @swagger
 * /collection:
 *   post:
 *     summary: Create a new collection.
 *     tags: [Collection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: Collection contract address.
 *                 example: EBCAcaBF62049A68Ca441Ac5D938
 *               name:
 *                 type: string
 *                 description: Name of the collection.
 *                 example: Leanne Graham
 *               symbol:
 *                 type: string
 *                 description: Symbol of the collection.
 *                 example: LGMm
 *               tokenType:
 *                 type: string
 *                 description: Token type of the collection.
 *                 example: ERC4907
 *               createdBy:
 *                 type: string
 *                 description: Creator wallet address.
 *                 example: 8fE67735aC2993841590a2eD1F
 *     responses:
 *       200:
 *         description: Created collection.
 *         content:
 *           application/json:
 *              schema:
 *               type: object
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
 *                         description: collection symbol.
 *                         example: ABC
 *                       tokenType:
 *                         type: string
 *                         description: Creator of the collection.
 *                         example: ABC454545
 *                       createdBy:
 *                         type: string
 *                         description: Number of tokens in the collection.
 *                         example: 4
 *                       createdAt:
 *                         type: string
 *                         description: Username of the creator
 *                         example: add
 *                   
 *       500:
 *         description: Some server error
*/

router.post('/', createCollection);

/**
 * @swagger
 * tags:
 *   name: Collection
 *   description: Managing Collections
 * /collection/{userAddress}:
 *   get:
 *     summary: Get all collections of a user
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: userAddress
 *         required: true
 *         description: User wallet address.
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
 *                       name:
 *                         type: string
 *                         description: Name of the collection.
 *                         example: Cricket Heroes
 *                       symbol:
 *                         type: string
 *                         description: collection symbol.
 *                         example: ABC
 *                       tokenType:
 *                         type: string
 *                         description: Creator of the collection.
 *                         example: ABC454545
 *                       createdBy:
 *                         type: string
 *                         description: Number of tokens in the collection.
 *                         example: 4
 *                       createdAt:
 *                         type: string
 *                         description: Username of the creator
 *                         example: add
 *                   
 *       500:
 *         description: Some server error
 *
 */
router.get('/:userAddress', getCollectionByID);

router.post('/wrapper', createWrapperCollection);

module.exports = router;
