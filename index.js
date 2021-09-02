const express = require('express')
const cors = require('cors')
const store = require('./store')
const app = express()

// middlewares - chain of responsability
app.use(cors())
app.use(express.json()) // parsea el body a JSON

const logger = (req, res, next) => {
  // autenticación, trazabilidad
  console.log("Llegó una nueva petición")
  next()
}
// app.use(logger)

// rutas - endpoints - controladores
app.get('/tasks', logger, (req, res) => {
  res.json(store.list())
})

app.post('/tasks', (req, res) => {
  const task = store.create({ title: req.body.title })
  res.status(201).json(task)
})

app.delete('/tasks/:id', (req, res) => {
  store.delete(req.params.id)
  res.status(204).end()
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: err.message })
})

app.listen(3001, () => console.log("Servidor corriendo ..."))

// AJAX (Asynchronous JavaScript And XML) - llamados del cliente a servidor
// Google Maps