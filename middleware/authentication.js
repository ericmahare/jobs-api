const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization
  if(!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({
      msg: "Not authorized to access this route"
    })
  }
  const token = authHeaders.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userID).select('-password')
    const {name, email, _id} = user
    const userData = {name, email, userID:_id}
    req.user = userData
    next()
  } catch (error) {
    res.status(401).json({
      msg: "Not authorized to access this route"
    })
  }
}

module.exports = authMiddleware
