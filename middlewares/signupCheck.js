//export du middlware qui vérifie que l'email et le mot de passe soient bien conformes
module.exports = (req, res, next) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //generate by copilot
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //generate by copilot

  if (!emailRegex.test(req.body.email))
    return res.status(400).json({ message: 'Email is invalid' });

  if (!passwordRegex.test(req.body.password))
    return res.status(400).json({ message: 'Password is invalid' });

  next(); //passe au prochain middlware
};
