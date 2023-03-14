const express = require('express');
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { mintNFT, saveMintNFT } = require('../controller/mintController');

// router.post('/ipfs', upload.single('image'), mintNFT);
router.post('/ipfs', mintNFT);
router.post('/', saveMintNFT);

module.exports = router;
