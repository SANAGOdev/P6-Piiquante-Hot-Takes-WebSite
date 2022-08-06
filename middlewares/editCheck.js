var jwt = require('jsonwebtoken'); //import de la librarie jwt
require('dotenv').config(); //import de la librarie dotenv
const SECRET_TOKEN = process.env.SECRET_TOKEN; //import de la clée privée
const Sauce = require('../models/sauce'); //import Sauce model

//export d'une middlware
module.exports = (req, res, next) => {
  //vérifie qu'un id est spécifié
  if (!req.params.id)
    return res.status(400).json({ message: 'Sauce Not Specified' }); //renvoie une erreur dans le cas échéant
  //vérifie si le token est spécifié
  if (!req.headers.authorization)
    return res.status(403).json({ message: 'Authorization Not Specified' }); //renvoie une erreur dans le cas échéant

  const id = req.params.id; //récupération de l'id
  const token = req.headers.authorization.split(' ')[1]; //récupération du token

  //vérifie que le token corresponde à l'id et ne soit pas expiré
  jwt.verify(token, `${SECRET_TOKEN}`, (err, decoded) => {
    if (err) return res.status(403).json(err); //renvoie une erreur dans le cas échéant

    Sauce.findOne({ _id: id })
      .then((sauce) => {
        if (decoded.userId && decoded.userId == sauce.userId) next();
        else
          return res
            .status(403)
            .json({ message: 'You are not owner of this sauce' }); //renvoie une erreur dans le cas échéant
      })
      .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
  });
};
