const jwt = require('jsonwebtoken')

const logger = (req, res, next) => {
  // autenticación, trazabilidad
  console.log("Llegó una nueva petición")
  next()
}

const auth = (req, res, next) => {
  try {
    const token = req.get('Authorization')
    const data = jwt.verify(token, 'secret key') // { userId: "12345"}
    console.log("Data del token:", data)
    console.log("UserId: ", data.userId)
    
    // cargar el usuario a partir del userId que llega en el token
    next()
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  logger,
  auth
}