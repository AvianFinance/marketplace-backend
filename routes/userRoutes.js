const express = require('express');
const router = express.Router();

const dbo = require("../database/conn");

const { getUserById, loggedUser, updateUser } = require('../controller/userController');

router.get('/:id',  getUserById);
router.get('/login/:id',  loggedUser);
router.put('/:id',  updateUser);



module.exports = router;