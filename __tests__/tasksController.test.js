const request = require('supertest')
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../user');
const { generateJWT } = require('../utils');
const Task = require('../task');

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

describe('GET /tasks', () => {
  let user, token;
  beforeEach(async () => {
    user = await User.create({ email: "test@example.com", password: "test1234", firstName: "Pedro", lastName: "Perez" })
    token = generateJWT(user)
  })

  test('responds 401 if user not authenticated', async () => {
    const response = await request(app)
      .get('/tasks')
    
      expect(response.statusCode).toBe(401)
  })

  test('responds 200 if user is authenticated', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', token)

    expect(response.statusCode).toBe(200)
  })

  test('responds with and empty list of tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', token)

    expect(response.body).toEqual({ count: 0, data: [], page: 1 })
  })

  test('responds with a list of tasks', async () => {
    let task1 = await Task.create({ title: "Tarea 1" })
    const task2 = await Task.create({ title: "Tarea 2" })

    const response = await request(app)
      .get('/tasks')
      .set('Authorization', token)

    const { count, data, page } = response.body
    expect(count).toBe(2)
    expect(data.length).toBe(2)
    expect(page).toBe(1)

    expect(data[0]._id).toBe(task1._id.toString())
    expect(data[0].title).toBe(task1.title)
    expect(data[0].completed).toBe(task1.completed)

    expect(data[1]._id).toBe(task2._id.toString())
    expect(data[1].title).toBe(task2.title)
    expect(data[1].completed).toBe(task2.completed)
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

describe('DELETE /tasks/:id', () => {
  let token, task;
  beforeEach(async () => {
    const user = await User.create({ email: "test@example.com", password: "test1234", firstName: "Pedro", lastName: "Perez" })
    token = generateJWT(user)
    task = await Task.create({ title: "Mi tarea" })
  })

  test('responds 401 if user not authenticated', async () => {
    const response = await request(app)
      .delete(`/tasks/${task._id}`)
    
      expect(response.statusCode).toBe(401)
  })

  test('responds 204 if user is authenticated', async () => {
    const response = await request(app)
      .delete(`/tasks/${task._id}`)
      .set('Authorization', token)
    
      expect(response.statusCode).toBe(204)
  })

  test('deletes task', async () => {
    const response = await request(app)
      .delete(`/tasks/${task._id}`)
      .set('Authorization', token)

    expect(await Task.findById(task._id)).toBeNull()
  })
})