const express = require('express')
const app = express()

// rutas
app.get('/tasks', (req, res) => {
  res.json([
    { id: 1, title: "Tarea 1", completed: false},
    { id: 2, title: "Nueva Tarea 2", completed: true},
    { id: 3, title: "Tarea 3", completed: false},  
  ])
})

app.listen(3001, () => console.log("Servidor corriendo ..."))