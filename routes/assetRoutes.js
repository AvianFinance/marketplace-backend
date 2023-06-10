const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getOneNft, getNftActivity, getNftCollectionActivity, getUserNftActivity } = require('../controller/assetController');

router.get('/colactivity/:collectionId', getNftCollectionActivity);
router.get('/profile/:address', getUserNftActivity);
router.get('/:collectionId/:tokenId', getOneNft);
router.get('/activity/:collectionId/:tokenId', getNftActivity);


module.exports = router;
