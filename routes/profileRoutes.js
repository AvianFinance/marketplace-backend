const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getOwned, getCollected, getRented, getCollections, getListed, getLended } = require('../controller/profileController');

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/collected:
 *   get:
 *     summary: Retrieve a list of collected NFTS by user
 *     tags: [Profile]
*/
router.get('/collected/:userAdd', getCollected);

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/owned:
 *   get:
 *     summary: Retrieve a list of owned NFTS by user
 *     tags: [Profile]
*/
router.get('/owned/:userAdd', getOwned);

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/collections:
 *   get:
 *     summary: Retrieve a list of collections created by user
 *     tags: [Profile]
*/
router.get('/collections/:userAdd', getCollections);

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/listed:
 *   get:
 *     summary: Retrieve a list of NFTS listed on the marketplace
 *     tags: [Profile]
*/
router.get('/listed/:userAdd', getListed);

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/collected:
 *   get:
 *     summary: Retrieve a list of rented NFTS by user
 *     tags: [Profile]
*/
router.get('/rented/:userAdd', getRented);

/**
 * @swagger
 *  tags:
 *   name: Profile
 *   description: Managing user profile 
 * /profile/collected:
 *   get:
 *     summary: Retrieve a list of rented NFTS by user
 *     tags: [Profile]
*/
router.get('/lended/:userAdd', getLended);

module.exports = router;
