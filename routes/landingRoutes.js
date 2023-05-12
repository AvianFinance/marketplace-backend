const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getBasicInfo } = require('../controller/landingController');

router.get('/', getBasicInfo);

module.exports = router;
