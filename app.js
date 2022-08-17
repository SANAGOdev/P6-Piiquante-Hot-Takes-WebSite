const path = require('path'); //import librairie path

const mongoose = require('mongoose'); //import librairie mongoose
const express = require('express'); //import librairie express

const usersRoutes = require('./routes/users'); //import du fichier routes users.js
const saucesRoutes = require('./routes/sauces'); //import du fichier routes sauces.js

const app = express(); //initialisation de l'application

const config = require('./config'); //import de la configuration
const port = config.port; //récupération du port depuis la config

require('dotenv').config(); //import librarie dotenv
const DB_USERNAME = process.env.DB_USERNAME; //récupération du username de la DB depuis les variables environnement
const DB_PASSWORD = process.env.DB_PASSWORD; //récupération du password de la DB depuis les variables environnement

//////////middlware par defaut affécté à chaques requêtes\\\\\\\\\\
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth/', usersRoutes); //rediriger toutes les routes du path /api/auth/ au fichier usersRoutes importé ligne 6
app.use('/api/', saucesRoutes); //rediriger toutes les routes du path /api/ au fichier saucesRoutes importé ligne 7

app.use('/images', express.static(path.join(__dirname, 'images'))); //définir le contenu du dossier images comme étant statique
app.use(express.static('images')); //définir le dossier images comme étant statique

//////////Démarrage de l'application\\\\\\\\\\
app.listen(port, () => {
  console.log('HotTakes app listening on port ' + port);

  //connection à la base de donnée
  mongoose
    .connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@p6-api-sauce.hbnnstp.mongodb.net/myFirstDatabase`
    )
    .then(() => console.log('MongoDB connected!!'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));
});
