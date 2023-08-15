const statusCodes = require('http-status-codes')
const User = require('../models/User')

// register user
exports.register = async (req, res) => {
  const {name, email, password} = req.body
  if(!name || !email || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: "failed",
      msg: 'All user values are required'
    })
  }
  try {
    const user = await User.create(req.body)
    const token = user.createToken()
    res.status(statusCodes.CREATED).json({
      user: {name: user.name},
      token
    })
  } catch (error) {
    res.status(statusCodes.BAD_REQUEST).json({
      msg: error
    })
  }
}

// user login
exports.login = async (req, res) => {
  const {email, password} = req.body
  if(!email || !password) {
    return res.status(401).json({
      status: "Failed",
      msg: "All fields are required"
    })
  }
  const user = await User.findOne({email})
  if(!user) {
    return res.status(401).json({
      status: "Failed",
      msg: "Ivalid credentials, please check your email or password"
    })
  }
  // compare password
  const passwordValid = await user.comparePassword(password)
  if(!passwordValid) {
    return res.status(401).json({
      status: 'Failed',
      msg: 'Invalid credentials, please check your email or password'
    })
  }
  const token = user.createToken()
  res.status(200).json({
    status: "success",
    user: {name: user.name},
    token
  })
}
