const User = require('./user');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const data = jwt.verify(token, 'secret key'); // { userId: "12345"}

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(data.userId) });
    if (user) {
      res.locals.user = user
      next();
    } else {
      res.status(401).json({ response: "not-authorized", message: 'No Authorized' });
    }
    next(err);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ response: "invalid-token", message: 'Invalid Token' });
    } else if (err.name === 'TokenExpiredError') {
      res.status(401).json({ response: "token-expired", message: "Token Expired" });
    }
  }
};

module.exports = {
  auth,
};
