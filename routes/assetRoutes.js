const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getOneNft } = require('../controller/assetController');

router.get('/:collectionId/:tokenId',  getOneNft);

module.exports = router;