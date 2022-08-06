const multer = require('multer'); //import de la librarie multer

//définie la manière de stocker les images
const storage = multer.diskStorage({
  destination: './images/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const name =
      file.fieldname +
      '-' +
      uniqueSuffix +
      '.' +
      file.originalname.split('.').pop();
    cb(null, name);
  },
});

//export du middlware multer qui enregistre les images
module.exports = multer({
  storage: storage,
  limits: {
    files: 1, // ajout maximale d'un fichier par requêtes
    fieldSize: 5 * 1024 * 1024, // taille maximale de 5MB par fichiers
  },
  fileFilter: (req, file, cb) => {
    // filtre de l'extension de l'image
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
  },
});
