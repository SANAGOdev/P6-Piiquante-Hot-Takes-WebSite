const mongoose = require('mongoose'); //import de la librairie mongoose

//création du schema sauce
const sauceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, index: true, unique: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: String, default: [] }],
  usersDisliked: [{ type: String, default: [] }],
});

module.exports = mongoose.model('sauces', sauceSchema); //export du model créer sur le schema sauces
