const express = require('express'); //import librairie express

const router = express.Router(); //initialisation du router

const userController = require('../controllers/user'); //import du controller user.js

const signUpCheck = require('../middlewares/signupCheck'); //import du middleware signupCkeck.js

router.post('/signup', signUpCheck, userController.signup); //définition du path /signup avec ses middlwares et ses controllers

router.post('/login', userController.login); //définition du path /login avec ses middlwares et ses controllers

module.exports = router; //export le router
