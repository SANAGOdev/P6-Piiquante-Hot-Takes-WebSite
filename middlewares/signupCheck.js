const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();

//export du middlware qui vérifie que l'email et le mot de passe soient bien conformes
module.exports = (req, res, next) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //generate by copilot
  passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces();

  if (!emailRegex.test(req.body.email))
    return res.status(400).json({ message: 'Email is invalid' });

  if (!passwordSchema.validate(req.body.password))
    return res.status(400).json({ message: 'Password is invalid' });

  next(); //passe au prochain middlware
};
