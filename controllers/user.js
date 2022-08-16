const bcrypt = require('bcrypt'); //import de la librairie bcrypt
var jwt = require('jsonwebtoken'); //import de la librairie jwt
require('dotenv').config(); //import de la dotenv
const SECRET_TOKEN = process.env.SECRET_TOKEN; //import de la clée privée

const User = require('../models/user'); //import du model User

//export du controller signup
exports.signup = (req, res, next) => {
  //chiffrage du mot de passe
  bcrypt
    .hash(req.body.password, 12) //12 tours de chiffrage
    .then((hash) => {
      const user = new User({ email: req.body.email, password: hash }); //récupération de l'email/mot de passe utilisateur

      user
        .save() //sauvegarde de l'utilsateur dans la base de donnée
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch((err) => res.status(401).json(err)); //renvoie une erreur dans le cas échéant
    })
    .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
};

//export du controller login
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //récupération de l'email utilisateur
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'User not exist' }); //renvoie une erreur dans le cas échéant
        return;
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (!result) {
            res.status(401).json({ message: 'Wrong password' }); //renvoie une erreur dans le cas échéant
            return;
          }
          //création du payload renvoyé au client
          const payload = {
            userId: user._id.toString(),
            token: jwt.sign(
              { userId: user._id.toString() },
              `${SECRET_TOKEN}`,
              { expiresIn: '24h' }
            ),
          };

          res.status(200).json(payload);
        })
        .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
    })
    .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
};
