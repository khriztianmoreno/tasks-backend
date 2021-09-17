const User = require('./user');
var jwt = require('jsonwebtoken');
const { generateJWT } = require('./utils');

const login = async (req, res) => {
  // recibir credenciales (email y contraseña) y retornar un JWT
  const { email, password } = req.body;

  const user = await User.authenticate(email, password);
  if (user) {
    // retornamos el JWT
    const token = generateJWT(user);
    res.json({ token });
  } else {
    res.status(401).json({ error: "invalid-credentials", message: 'Credenciales inválidas' });
  }
}

const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const user = await User.create({ email, password, firstName, lastName })
  res.status(201).json({ email: user.email })
}

const me = async (req, res) => {
  const { email, firstName, lastName } = res.locals.user
  res.json({ email, firstName, lastName })
}

module.exports = {
  login,
  register,
  me
}