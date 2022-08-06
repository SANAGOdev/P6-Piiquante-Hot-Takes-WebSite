const mongoose = require('mongoose'); //import de la librairie mongoose

//création du schema utilisateur
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', userSchema); //export du model créer sur le schema utilisateur
