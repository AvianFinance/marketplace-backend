const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getOneNft, getNftActivity } = require('../controller/assetController');

router.get('/:collectionId/:tokenId',  getOneNft);
router.get('/activity/:collectionId/:tokenId',  getNftActivity);

module.exports = router;
