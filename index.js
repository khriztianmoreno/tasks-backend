require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const store = require('./store');
const routes = require('./routes');
const app = express();
const User = require('./user');

// Variables de entorno

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

mongoose.connection.on('error', function (e) {
  console.error(e);
});

// middlewares - chain of responsability
app.use(cors());
app.use(express.json()); // parsea el body a JSON

// rutas - endpoints - controladores
app.use(routes);

// manejo global de errores
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT} ...`));