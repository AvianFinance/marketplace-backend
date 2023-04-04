const express = require('express');
const router = express.Router();

const { mintNFT, saveMintNFT, depositNFT } = require('../controller/mintController');

router.post('/ipfs', mintNFT);
router.post('/', saveMintNFT);
router.post('/deposit', depositNFT);

module.exports = router;
