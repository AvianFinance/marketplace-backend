const express = require('express');
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { mintNFT } = require('../controller/mintController');

router.post('/ipfs', upload.single('image'), mintNFT);

module.exports = router;