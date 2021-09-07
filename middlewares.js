const logger = (req, res, next) => {
  // autenticación, trazabilidad
  console.log("Llegó una nueva petición")
  next()
}

module.exports = {
  logger
}