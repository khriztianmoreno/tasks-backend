const request = require('supertest')
const mongoose = require('mongoose');
const app = require('../app')

afterAll(() => {
  mongoose.disconnect()
})

beforeEach(async () => {
  // antes de cada prueba limpiamos todas las colecciones para iniciar con una
  // base de datos en blanco
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].deleteMany({});
  }
});

describe('GET /test', () => {
  test('responds 200 OK', async () => {
    const response = await request(app).get('/test')
    expect(response.statusCode).toBe(200)
  })

  test('responds with correct JSON', async () => {
    const response = await request(app).get('/test')
    expect(response.body).toEqual({ status: "ok" })
  })
})

describe('POST /tasks', () => {
  test('responds 201', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({ title: "Mi primera tarea" })
    
    expect(response.statusCode).toBe(201)
  })

  test('returns task with _id', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({ title: "Mi primera tarea" })
    
    expect(response.body._id).not.toBeFalsy()
  })
})
