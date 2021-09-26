/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tasks              ->  index
 * POST    /api/tasks              ->  create
 * GET     /api/tasks/:id          ->  show
 * DELETE  /api/tasks/:id          ->  destroy
 */
const Task = require('./task.model');

async function index(req, res) {
  const page = req.query.page || 1
  const count = await Task.count()

  try {
    const data = await Task.find({}, null, {
      skip: (page - 1) * 10,
      limit: 20
    })

    res.json({
      count,
      page,
      data
    });
  } catch (error) {
    res.status(500)
  }
}

const create = async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title
    });
    res.status(201).json(task);
  } catch (err) {
    console.log("🚀 ~ file: tasksController.js ~ line 22 ~ create ~ err", err)
    if (err.name === 'ValidationError') {
      res.status(422).json(err.errors);
    } else {
      next(err);
    }
  }
};

const destroy = (req, res) => {
  const {
    id: taskId
  } = req.params

  try {
    const result = Task.findByIdAndDelete(taskId).exec()

    return res.status(200).send(result)
  } catch (error) {
    console.log('Error customer server: ', error)
    return res.status(500).send(error)
  }
};

/**
 * Updates a task
 */
function update(req, res) {
  const {
    id: taskId
  } = req.params

  try {
    const updated = Task.findByIdAndUpdate({
      _id: taskId
    }, req.body, {
      upsert: true,
      new: true,
    })
    .exec()

    return res.status(204).send(updated)
  } catch (error) {
    console.log('Error customer server: ', error)
    return res.status(500).send(error)
  }
}

module.exports = {
  create,
  destroy,
  update,
  index
};
