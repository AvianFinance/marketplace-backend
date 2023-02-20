const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getOwned, getCollected, getRented, getCollections} = require('../controller/profileController');

router.get('/collected/:userAdd',  getCollected);
router.get('/owned/:userAdd',  getOwned);
router.get('/rented/:userAdd',  getRented);
router.get('/collections/:userAdd',  getCollections);

module.exports = router;