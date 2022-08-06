const express = require('express'); //import librairie express

const router = express.Router(); //initialisation du router

const sauceController = require('../controllers/sauce');

const upload = require('../middlewares/multer'); //Import upload middleware
const authCheck = require('../middlewares/authCheck'); //import du middleware authCheck.js
const editCheck = require('../middlewares/editCheck'); //import du middleware editCheck.js

//définition du path GET /sauces avec ses middlwares et ses controllers
router.get('/sauces', authCheck, sauceController.listSauces);

//définition du path POST /sauces avec ses middlwares et ses controllers
router.post(
  '/sauces',
  authCheck,
  upload.single('image'),
  sauceController.addSauce
);

//définition du path GET /sauces/:id avec ses middlwares et ses controllers
router.get('/sauces/:id', authCheck, sauceController.getSauce);

//définition du path PUT /sauces/:id avec ses middlwares et ses controllers
router.put(
  '/sauces/:id',
  authCheck,
  editCheck,
  upload.single('image'),
  sauceController.updateSauce
);

//définition du path DELETE /sauces/:id avec ses middlwares et ses controllers
router.delete('/sauces/:id', authCheck, editCheck, sauceController.deleteSauce);

//définition du path POST /sauces/:id/like avec ses middlwares et ses controllers
router.post('/sauces/:id/like', authCheck, sauceController.likeSauce);

module.exports = router; //export de la route sauces
