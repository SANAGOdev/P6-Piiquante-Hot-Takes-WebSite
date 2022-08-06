var fs = require('fs'); //import de la librairie fs

const config = require('../config'); //import de la configuration
const port = config.port; //récupération du port depuis la config

const Sauce = require('../models/sauce'); //import de la librairie bcrypt

//export du controller listSauces
exports.listSauces = (req, res, next) => {
  Sauce.find({})
    .then((sauces) => res.status(200).json(sauces)) //renvoie la liste des sauces au client
    .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
};

//export du controller addSauce
exports.addSauce = (req, res, next) => {
  const body = JSON.parse(req.body.sauce);

  //création de la sauce
  const sauce = new Sauce({
    userId: body.userId,
    name: body.name,
    manufacturer: body.manufacturer,
    description: body.description,
    mainPepper: body.mainPepper,
    imageUrl:
      req.protocol +
      '://' +
      req.hostname +
      ':' +
      port +
      '/images/' +
      req.file.filename, //ajout dynamique
    heat: body.heat,
  });

  //condition pour le heat maximal et minimal
  if (body.heat < 0 || body.heat > 10) {
    if (req.file) {
      fs.unlinkSync('images/' + req.file.filename);
    }
    return res.status(400).json({ message: 'heat incorect' }); //renvoie une erreur dans le cas échéant
  }

  //sauvegarde de la sauce
  sauce
    .save()
    .then(() => res.status(200).json({ message: 'Success' }))
    .catch((err) => res.status(500).json(err)); //renvoie une erreur dans le cas échéant
};

//exportation du controller getSauce
exports.getSauce = (req, res, next) => {
  const id = req.params.id; //récupération de l'id
  //récupération de la sauce
  Sauce.findOne({ _id: id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(500).json(err));
};

//export du controller updateSauce
exports.updateSauce = (req, res, next) => {
  const id = req.params.id;

  const body = req.file ? JSON.parse(req.body.sauce) : req.body;
  //vérification que lors de la modification de la sauce que le heat soit correcte
  if (body.heat < 0 || body.heat > 10) {
    if (req.file) {
      fs.unlinkSync('images/' + req.file.filename);
    }
    return res.status(400).json({ message: 'heat incorect' });
  }
  //modification de la sauce
  Sauce.findOne({ _id: id })
    .then((sauce) => {
      sauce.userId = body.userId;
      sauce.name = body.name;
      sauce.manufacturer = body.manufacturer;
      sauce.description = body.description;
      sauce.mainPepper = body.mainPepper;
      sauce.heat = body.heat;

      if (req.file) {
        fs.unlinkSync(
          sauce.imageUrl.replace(
            req.protocol + '://' + req.hostname + ':' + port + '/',
            ''
          )
        );
        sauce.imageUrl =
          req.protocol +
          '://' +
          req.hostname +
          ':' +
          port +
          '/images/' +
          req.file.filename;
      }

      sauce.save(); //enregistrement des modifications
      res.status(200).json({ message: 'Succes' });
    })
    .catch((err) => res.status(500).json(err));
};

//export du controller deleteSauce
exports.deleteSauce = (req, res, next) => {
  const id = req.params.id;

  Sauce.findByIdAndRemove(id)
    .then((sauce) => {
      fs.unlinkSync(
        sauce.imageUrl.replace(
          req.protocol + '://' + req.hostname + ':' + port + '/',
          ''
        )
      );
      res.status(200).json({ message: 'Success' });
    })
    .catch((err) => res.status(500).json(err));
};

//export du controller likeSauce
exports.likeSauce = (req, res, next) => {
  const id = req.params.id;

  const userId = req.body.userId;

  const like = req.body.like;
  //ajout du like
  Sauce.findById({ _id: id })
    .then((sauce) => {
      //vérification si la personne essaye de like ou dislike
      if (like == 1 || like == -1)
        if (
          sauce.usersLiked.includes(userId) ||
          sauce.usersDisliked.includes(userId)
        )
          //vérification si le like est déjà mis et renvoie une erreur si il l'est
          return res.status(400).json({ message: 'Like already set' });
      //si le client veut like
      if (like == 1)
        //ajout du like
        Sauce.findByIdAndUpdate(
          { _id: id },
          { $addToSet: { usersLiked: userId }, $inc: { likes: 1 } }
        )
          .then(res.status(200).json({ message: 'Success' }))
          .catch((err) => res.status(500).json(err));
      //si le client veut dislike
      else if (like == -1)
        //ajout du dislike
        Sauce.findByIdAndUpdate(
          { _id: id },
          { $addToSet: { usersDisliked: userId }, $inc: { dislikes: 1 } }
        )
          .then(res.status(200).json({ message: 'Success' }))
          .catch((err) => res.status(500).json(err));
      //si le client veut supprimer son like ou dislike
      else {
        if (sauce.usersLiked.includes(userId))
          //retire le like
          Sauce.findByIdAndUpdate(
            { _id: id },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(res.status(200).json({ message: 'Success' }))
            .catch((err) => res.status(500).json(err));
        if (sauce.usersDisliked.includes(userId))
          //retire le dislike
          Sauce.findByIdAndUpdate(
            { _id: id },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(res.status(200).json({ message: 'Success' }))
            .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).json(err);
    });
};
