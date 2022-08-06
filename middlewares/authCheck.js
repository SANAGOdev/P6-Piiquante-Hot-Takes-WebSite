const jwt = require('jsonwebtoken'); //import de la librarie jwt
require('dotenv').config(); //import de la librarie dotenv
const SECRET_TOKEN = process.env.SECRET_TOKEN; //import de la clée privée

//export d'une middlware
module.exports = (req, res, next) => {
  //vérifie qu'un token est spécifié
  if (!req.headers.authorization)
    return res.status(403).json({ message: 'Authorization Not Specified' }); //renvoie une erreur dans le cas échéant

  const token = req.headers.authorization.split(' ')[1]; //récupération du token

  //vérifie que le token corresponde à l'id et ne soit pas expiré
  jwt.verify(token, `${SECRET_TOKEN}`, (err, decoded) => {
    if (err) return res.status(403).json(err); //renvoie une erreur dans le cas échéant

    next(); //passe au prochain middlware
  });
};
