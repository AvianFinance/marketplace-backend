const express = require('express');
const router = express.Router();

const { mintNFT, saveMintNFT } = require('../controller/mintController');

router.post('/ipfs', mintNFT);
router.post('/', saveMintNFT);

module.exports = router;
